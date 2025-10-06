export default defineEventHandler(async event => {
  const { id, type, reason, team_reason, relationship } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (f:Entry:$($type) {id: $id})-[t:$($relationship)]->(e:Event)
      SET t.reason = $reason, t.team_reason = $team_reason
      RETURN f
    `,
    {
      id,
      type,
      reason: reason || null,
      team_reason: team_reason || null,
      relationship
    }
  )

  return summary
})
