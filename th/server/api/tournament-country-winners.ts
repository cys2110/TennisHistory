export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)<-[:ROUND_OF]-(:Round {round: 'Final'})<-[:PLAYED]-(:Match)<-[:SCORED]-(:Winner)<-[:SCORED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
      WITH c, MIN(e.start_date) AS first_win_date, COUNT(DISTINCT p) AS wins
      ORDER BY wins DESC, first_win_date ASC
      RETURN toString(wins) AS wins, {id: c.id, name: c.name, alpha2: c.alpha2} AS country
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.toObject())

  return results
})
