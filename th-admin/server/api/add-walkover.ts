export default defineEventHandler(async event => {
  const { id, type, draw, reason, team_reason, eid } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (e:Event {id: toInteger($eid)})
      MATCH (f:Entry:$($type) {id: $id})-[:SCORED]->(s:$($draw))-[:SCORED]->(m:Match)<-[:SCORED]-(s1:Score) WHERE s:Loser OR (NOT s:Winner AND NOT s:Loser)
      MERGE (f)-[t:WALKOVER]->(e)
      SET t.reason = $reason, t.team_reason = $team_reason, s.incomplete = 'WO', m.incomplete = 'WO'
      CALL (*) {
        WITH s1, s
        WHERE NOT s:Loser
        SET s:Loser, s1:Winner
      }
      RETURN f
    `,
    {
      id,
      type,
      reason: reason || null,
      team_reason: team_reason || null,
      draw,
      eid
    }
  )

  return summary
})
