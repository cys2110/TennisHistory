export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
  }

  const { id } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH a=(d:Coach {id: $id})-[:COACHES]->(p:Player)
      MATCH (p)-[:REPRESENTS]->(c:Country)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH DISTINCT p, c, collect(DISTINCT y.id) AS years, d
      ORDER BY p.last_name
      WITH p, c, d,
        CASE WHEN years = [] THEN null ELSE apoc.coll.min(years) END AS min_year,
        CASE WHEN years = [] THEN null ELSE apoc.coll.max(years) END AS max_year
      RETURN{
        id: p.id,
        name: p.first_name + ' ' + p.last_name,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        min_year: toString(min_year),
        max_year: toString(max_year)
      } AS player, labels(d) AS labels, d.first_name || ' ' || d.last_name AS name
    `,
    { id }
  )

  const results = records.map(record => record.get("player"))
  const labels = records[0].get("labels")
  const name = records[0].get("name")
  return { players: results.map(r => ({ ...r, min_year: Number(r.min_year), max_year: Number(r.max_year) })), labels, name }
})
