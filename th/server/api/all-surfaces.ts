export default defineEventHandler(async query => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface)
      WITH COLLECT(s) AS all, COUNT(s) AS count
      UNWIND all AS s
      ORDER BY s.surface, s.environment
      RETURN toString(count) AS count, s.id AS surface
    `
  )

  const count = records[0].get("count")
  const surfaces = records.map(record => record.get("surface"))

  return { count: Number(count), surfaces }
})
