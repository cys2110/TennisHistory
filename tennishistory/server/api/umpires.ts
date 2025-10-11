export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (u:Umpire)
    RETURN DISTINCT properties(u) AS umpire
    ORDER BY umpire.last_name, umpire.first_name
    `
  )

  return records.map(r => r.get("umpire")).filter(Boolean)
})
