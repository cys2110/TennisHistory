export default defineEventHandler(async query => {
  const { p1Id, p2Id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p1:Player {id: $p1Id})-[:REPRESENTS]->(c1:Country)
      MATCH (p2:Player {id: $p2Id})-[:REPRESENTS]->(c2:Country)
      RETURN
      {
        id: c1.id,
        name: c1.name,
        alpha2: c1.alpha2
      } AS c1,
      {
        id: c2.id,
        name: c2.name,
        alpha2: c2.alpha2
      } AS c2
    `,
    { p1Id, p2Id }
  )

  const p1 = records[0].get("c1")
  const p2 = records[0].get("c2")

  return { p1, p2 }
})
