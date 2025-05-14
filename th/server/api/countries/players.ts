export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    letter: string
    skip: string
    sort: "ASC" | "DESC"
  }
  const { letter, skip, sort, id } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p:Player)-[:REPRESENTS|REPRESENTED]->(c:Country {id: $id}) WHERE $letter IS NULL OR p.last_name STARTS WITH $letter
      WITH p
        ORDER BY p.last_name ${sort}
      WITH COLLECT(p) AS players, COUNT(p) AS count
      WITH players[toInteger($skip)..toInteger($skip) + 25] AS players, count
      UNWIND CASE WHEN players = [] THEN [null] ELSE players END AS p
      MATCH (p)-[:REPRESENTS]->(c:Country)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH p, c, min(y.id) AS min_year, max(y.id) AS max_year, count
      RETURN DISTINCT {
        id: p.id,
        name: p.first_name || ' ' || p.last_name,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        current: CASE WHEN c.id = $id THEN true ELSE false END,
        min_year: toString(min_year),
        max_year: toString(max_year)
      } AS player, toString(count) AS count
    `,
    { id, letter: letter === "All" ? null : letter, skip, sort }
  )

  const playerObjects = records.map(record => record.get("player"))
  const players = playerObjects.filter(player => ({
    ...player,
    min_year: player.min_year ? Number(player.min_year) : null,
    max_year: player.max_year ? Number(player.max_year) : null
  }))
  const count = records[0].get("count")

  return { players, count: Number(count) }
})
