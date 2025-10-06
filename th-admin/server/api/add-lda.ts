import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    type: "Singles" | "Doubles"
    draw: "Main" | "Qualifying"
    rank: string
    eid: string
  }

  const { id, type, draw, rank, eid } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (e:Event {id: $eid})
      MATCH (f:Entry:$($type) {id: $id})
      CALL (*) {
        WHEN $draw = 'Main' THEN MERGE (f)-[:LDA {rank: $rank}]->(e)
        ELSE MERGE (f)-[:Q_LDA {rank: $rank}]->(e)
      }
      RETURN f
    `,
    {
      id,
      type,
      draw,
      rank: rank ? int(rank) : null,
      eid: int(eid)
    }
  )

  return summary
})
