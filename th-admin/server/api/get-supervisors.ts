export default defineEventHandler(async query => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Supervisor)
      RETURN properties(s) AS supervisor
      ORDER BY toLower(s.last_name), toLower(s.first_name)
    `
  )

  return records.map(record => record.get("supervisor"))
})
