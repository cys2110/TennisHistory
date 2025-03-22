export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
  }
  const { letter, skip } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player) WHERE $letter IS NULL OR p.last_name STARTS WITH $letter
      WITH COLLECT(p) AS all, COUNT(p) AS count
      UNWIND all AS p
      MATCH (p)-[:REPRESENTS]->(c:Country)
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(t:Year)
      OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
      ORDER BY p.last_name
      SKIP toInteger($skip)
      LIMIT 25
      RETURN toString(count) AS count, {
        id: p.id,
        name: p.first_name || ' ' || p.last_name,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        active_years: CASE
          WHEN r IS NOT NULL AND t IS NOT NULL THEN toString(t.id) || ' — ' || toString(r.id)
          WHEN t IS NOT NULL THEN toString(t.id) || ' — present'
          ELSE null
        END
      } AS player
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const count = records[0].get("count")
  const players = records.map(record => record.get("player"))

  return { count: Number(count), players }
})
