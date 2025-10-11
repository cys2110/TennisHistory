export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)
    RETURN properties(v) AS venue
    ORDER BY venue.city, venue.name
    `
  )

  return records.map(r => r.get("venue")).filter(Boolean)
})
