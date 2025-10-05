export default defineEventHandler(async event => {
  const { id, type, draw, reason, team_reason, team_mate } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      WHEN $draw = 'Main' THEN {
        MATCH (f:Entry:$($type) {id: $id})-[t:WITHDREW]->(e:Event)
        SET t.reason = $reason, t.team_reason = $team_reason, t.team_mate = $team_mate
      }
      ELSE {
        MATCH (f:Entry:$($type) {id: $id})-[t:Q_WITHDREW]->(e:Event)
        SET t.reason = $reason, t.team_reason = $team_reason, t.team_mate = $team_mate
      }
    `,
    {
      id,
      type,
      reason: reason || null,
      team_reason: team_reason || null,
      team_mate: team_mate || null,
      draw
    }
  )

  return summary
})
