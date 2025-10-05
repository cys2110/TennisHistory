export default defineEventHandler(async query => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
      RETURN {id: v.id, label: CASE WHEN v.name IS NULL THEN v.city || ', ' || c.name ELSE v.name || ', ' || v.city || ', ' || c.name END} AS venue
      ORDER BY toLower(v.city), toLower(v.name)
    `
  )

  return records.map(record => record.get("venue"))
})
