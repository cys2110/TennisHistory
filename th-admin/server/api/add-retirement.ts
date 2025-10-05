export default defineEventHandler(async event => {
  const { id, type, draw, reason, team_reason, eid } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (e:Event {id: toInteger($eid)})
      MATCH (f:Entry:$($type) {id: $id})-[:SCORED]->(s:Loser:$($draw))
      MERGE (f)-[t:RETIRED]->(e)
      SET t.reason = $reason, t.team_reason = $team_reason, s.incomplete = 'R'
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
