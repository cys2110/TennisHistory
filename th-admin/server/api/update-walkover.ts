export default defineEventHandler(async event => {
  const { id, type, reason, team_reason } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (f:Entry:$($type) {id: $id})-[t:WALKOVER]->(e:Event)
      SET t.reason = $reason, t.team_reason = $team_reason
      RETURN f
    `,
    {
      id,
      type,
      reason: reason || null,
      team_reason: team_reason || null
    }
  )

  return summary
})
