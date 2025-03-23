export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
  }
  const { letter, skip } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface) WHERE $letter IS NULL OR s.surface STARTS WITH $letter
      WITH COLLECT(s) AS all, COUNT(s) AS count
      UNWIND all AS s
      ORDER BY s.surface, s.environment
      SKIP toInteger($skip)
      LIMIT 25
      RETURN toString(count) AS count, s.id AS surface
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const count = records[0].get("count")
  const surfaces = records.map(record => record.get("surface"))

  return { count: Number(count), surfaces }
})
