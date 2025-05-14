export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:REPRESENTS]->(c:Country)
      RETURN
        {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        } AS country,
        p.gladiator AS gladiator
    `,
    { id }
  )

  const results = records[0].toObject()

  return results
})
