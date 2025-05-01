export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }
  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)
        WHERE $letter IS NULL OR p.last_name STARTS WITH $letter
      WITH p
        ORDER BY p.last_name
      WITH COLLECT(p) AS all, COUNT(p) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS p
      MATCH (p)-[:REPRESENTS]->(c:Country)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH p, count, c, collect(DISTINCT y.id) AS years
      WITH p, c, count,
          CASE WHEN years = [] THEN null ELSE apoc.coll.min(years) END AS min_year,
          CASE WHEN years = [] THEN null ELSE apoc.coll.max(years) END AS max_year
      RETURN toString(count) AS count,
      {
        id: p.id,
        name: p.first_name + ' ' + p.last_name,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        min_year: toString(min_year),
        max_year: toString(max_year)
      } AS player
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const players = records.map(record => record.get("player"))

  return {
    count: Number(count),
    players: players.map(p => ({
      ...p,
      min_year: Number(p.min_year),
      max_year: Number(p.max_year)
    }))
  }
})
