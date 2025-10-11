export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (s:Supervisor)
    RETURN DISTINCT properties(s) AS supervisor
    ORDER BY supervisor.last_name, supervisor.first_name
    `
  )

  return records.map(r => r.get("supervisor")).filter(Boolean)
})
