import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    type: "Singles" | "Doubles"
    draw: "Main" | "Qualifying"
    reason: string
    team_reason: string
    eid: string
  }

  const { id, type, draw, reason, team_reason, eid } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (e:Event {id: $eid})
      MATCH (f:Entry:$($type) {id: $id})-[:SCORED]->(s:Loser:$($draw))
      MERGE (f)-[t:DEFAULTED]->(e)
      SET t.reason = $reason, t.team_reason = $team_reason, s.incomplete = 'Def'
      RETURN f
    `,
    {
      id,
      type,
      reason: reason || null,
      team_reason: team_reason || null,
      draw,
      eid: int(eid)
    }
  )

  return summary
})
