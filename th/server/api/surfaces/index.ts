export default defineEventHandler(async query => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface)
      WITH s
        ORDER BY s.surface
      RETURN CASE
        WHEN
          s IS NULL
            THEN null
        ELSE
          {
            id: s.id,
            environment: s.environment,
            surface: s.surface
          }
      END AS surface
    `
  )

  const results = records.map(record => record.get("surface"))

  return results.filter(Boolean)
})
