export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
  }
  const { letter, skip } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Country) WHERE $letter IS NULL OR c.name STARTS WITH $letter
      WITH COLLECT(c) AS all, COUNT(c) AS count
      UNWIND all AS c
      ORDER BY c.name
      SKIP toInteger($skip)
      LIMIT 25
      RETURN toString(count) AS count, {id: c.id, name: c.name, alpha2: c.alpha2} AS country
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const count = records[0].get("count")
  const countries = records.map(record => record.get("country"))

  return { count: Number(count), countries }
})
