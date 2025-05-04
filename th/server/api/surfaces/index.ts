export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }

  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface)
        WHERE $letter IS NULL OR s.surface STARTS WITH $letter
      WITH s
        ORDER BY s.surface, s.environment
      WITH CASE
        WHEN s IS NULL THEN null
        ELSE {id: s.id, environment: s.environment, surface: s.surface}
      END AS surface
      WITH COLLECT(surface) AS all, COUNT(surface) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS surfaces, count
      RETURN toString(count) AS count, surfaces
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const surfaces = records[0].get("surfaces")

  return {
    count: Number(count),
    surfaces
  }
})
