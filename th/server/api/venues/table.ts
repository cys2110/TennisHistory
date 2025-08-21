export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WITH DISTINCT *
    ORDER BY c.name, v.city, v.name
    RETURN apoc.map.merge(properties(v), {country: properties(c)}) AS venue
    `
  )

  const results = records.map(record => record.get("venue"))

  return results
})
