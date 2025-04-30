export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)<-[:ROUND_OF]-(:Round {round: 'Final'})<-[:PLAYED]-(:Match)<-[:SCORED]-(s:Score)<-[:SCORED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
      WITH p, MIN(e.start_date) AS first_final_date, COUNT(*) AS finals, c, SUM(CASE WHEN s:Loser THEN 1 ELSE 0 END) AS losses, SUM(CASE WHEN s:Winner THEN 1 ELSE 0 END) AS wins
      ORDER BY finals DESC, first_final_date ASC
      RETURN toString(finals) AS finals, {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}} AS player, losses, wins
    `,
    { id: Number(id) }
  )

  const results = records.map(record => {
    const { finals, player, losses, wins } = record.toObject()
    return {
      finals: Number(finals),
      player,
      losses: Number(losses),
      wins: Number(wins)
    }
  })

  return results
})
