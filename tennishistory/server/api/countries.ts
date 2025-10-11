export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (c:Country)
    RETURN properties(c) AS country
    ORDER BY country.name
    `
  )

  return records.map(r => r.get("country")).filter(Boolean)
})
