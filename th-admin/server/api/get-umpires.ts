export default defineEventHandler(async query => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:Umpire)
      RETURN properties(u) AS umpire
      ORDER BY toLower(u.last_name), toLower(u.first_name)
    `
  )

  return records.map(record => record.get("umpire"))
})
