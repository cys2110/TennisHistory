export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country) WHERE apoc.text.compareCleaned(v.id, $id)
    RETURN apoc.map.merge(apoc.any.properties(v), {country: apoc.any.properties(c)}) AS venue
    `,
    { id }
  )

  return records[0].get("venue")
})
