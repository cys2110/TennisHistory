export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }
  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Country) WHERE $letter IS NULL OR c.name STARTS WITH $letter
      WITH c
      ORDER BY c.name
      WITH COLLECT(c) AS all, COUNT(c) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS c
      RETURN toString(count) AS count, {id: c.id, name: c.name, alpha2: c.alpha2} AS country
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const countries = records.map(record => record.get("country"))

  return { count: Number(count), countries }
})
