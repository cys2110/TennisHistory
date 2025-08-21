export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WITH *
    ORDER BY c.name, v.city, v.name
    WITH c, apoc.map.groupByMulti(COLLECT(DISTINCT properties(v)), "city") AS cities
    RETURN apoc.map.merge(properties(c), {cities: cities}) AS results
    `
  )

  const results = records.map(record => record.get("results"))

  return results
})
