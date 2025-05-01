export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }
  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Coach) WHERE $letter IS NULL OR c.last_name STARTS WITH $letter
      WITH c
      ORDER BY c.last_name
      WITH COLLECT(c) AS all, COUNT(c) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS c
      OPTIONAL MATCH (c)-[:REPRESENTS]->(x:Country)
      WITH c, CASE
        WHEN x IS NOT NULL THEN {id: x.id, name: x.name, alpha2: x.alpha2}
        ELSE NULL
      END AS country, count
      RETURN toString(count) AS count, {labels: labels(c), id: c.id, name: c.first_name || ' ' || c.last_name, country: country} AS coach
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const coaches = records.map(record => record.get("coach"))

  return { count: Number(count), coaches }
})
