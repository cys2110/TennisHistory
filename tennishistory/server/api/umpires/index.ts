export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (u:Umpire)
    WITH *
    ORDER BY toLower(u.last_name)
    RETURN properties(u) AS umpire
    `
  )

  const results = records.map(record => record.get("umpire"))

  return results
})
