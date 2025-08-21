export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (s:Supervisor)
    WITH *
    ORDER BY s.last_name
    RETURN properties(s) AS supervisor
    `
  )

  const results = records.map(record => record.get("supervisor"))

  return results
})
