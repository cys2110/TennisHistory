export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)<-[:ROUND_OF]-(:Round {round: 'Final'})<-[:PLAYED]-(:Match)<-[:SCORED]-(:Winner)<-[:SCORED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
      MATCH (e)-[:IN_YEAR]->(y:Year)
      WITH c, y, p
      ORDER BY y.id
      RETURN
        c.name AS country,
        toString(y.id) AS year,
        p.id AS player
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.toObject())

  return results
})
