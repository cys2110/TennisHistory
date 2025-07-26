export default defineEventHandler(async event => {
  const { letter } = getQuery<{ letter: string }>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WHERE $letter IS NULL OR toLower(c.name) STARTS WITH toLower($letter)
    WITH DISTINCT *
    ORDER BY c.name, v.city, v.name
    RETURN apoc.map.merge(apoc.any.properties(v), {country: apoc.any.properties(c)}) AS venue
    `,
    { letter: letter ?? null }
  )

  const results = records[0].toObject()

  return records.map((record: any) => record.get("venue"))
})
