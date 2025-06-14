export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue {id: $id})-[:LOCATED_IN]->(c:Country)
    RETURN {
      id: v.id,
      name: v.name,
      city: v.city,
      country: {
        id: c.id,
        name: c.name,
        alpha2: c.alpha2
      }
    } AS venue
    `,
    { id }
  )

  return records[0].get("venue")
})
