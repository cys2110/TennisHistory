export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (v:Venue {id: $id})-[:LOCATED_IN]->(c:Country)
      RETURN {
        name: c.name,
        id: c.id,
        alpha2: c.alpha2
      } AS country
    `,
    { id }
  )

  const results = records[0].toObject()

  return results.country
})
