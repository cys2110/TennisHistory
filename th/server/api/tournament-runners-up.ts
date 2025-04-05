export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)<-[:ROUND_OF]-(:Round {round: 'Final'})<-[:PLAYED]-(:Match)<-[:SCORED]-(:Loser)<-[:SCORED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
      WITH p, MIN(e.start_date) AS first_loss_date, COUNT(*) AS losses, c
      ORDER BY losses DESC, first_loss_date ASC
      RETURN toString(losses) AS losses, {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}} AS player
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.toObject())

  return results
})
