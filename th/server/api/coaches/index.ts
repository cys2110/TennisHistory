export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    sort: "ASC" | "DESC"
  }
  const { letter, skip, sort } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Coach) WHERE $letter IS NULL OR c.last_name STARTS WITH $letter
      WITH c
        ORDER BY c.last_name ${sort}
      WITH COLLECT(c) AS coaches, COUNT(c) AS count
      WITH coaches[toInteger($skip)..toInteger($skip) + 25] AS coaches, count
      UNWIND CASE WHEN coaches = [] THEN [null] ELSE coaches END AS c
      OPTIONAL MATCH (c)-[:REPRESENTS]->(x:Country)
      WITH c, CASE
        WHEN x IS NOT NULL THEN {id: x.id, name: x.name, alpha2: x.alpha2}
        ELSE NULL
      END AS country, count
      RETURN toString(count) AS count, {labels: labels(c), id: c.id, name: c.first_name || ' ' || c.last_name, country: country} AS coach
    `,
    { letter: letter === "All" ? null : letter, skip, sort }
  )

  const count = records[0].get("count")
  const coaches = records.map(record => record.get("coach"))

  return { count: Number(count), coaches: coaches.filter(Boolean) }
})
