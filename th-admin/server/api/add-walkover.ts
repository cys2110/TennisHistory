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
      MATCH (f:Entry:$($type) {id: $id})-[:SCORED]->(s:$($draw))-[:SCORED]->(m:Match)<-[:SCORED]-(s1:Score) WHERE s:Loser OR (NOT s:Winner AND NOT s:Loser)
      MERGE (f)-[t:WALKOVER]->(e)
      SET t.reason = $reason, t.team_reason = $team_reason, s.incomplete = 'WO', m.incomplete = 'WO'
      REMOVE m:Best3, m:Best5
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
      eid: int(eid)
    }
  )

  return summary
})
