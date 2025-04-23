export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }

  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface) WHERE $letter IS NULL OR s.last_name STARTS WITH $letter
      WITH s
      ORDER BY s.surface, s.environment
      WITH COLLECT(s) AS all, COUNT(s) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS s
      RETURN toString(count) AS count, s.id AS surface
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const surfaces = records.map(record => record.get("surface"))

  return { count: Number(count), surfaces }
})
