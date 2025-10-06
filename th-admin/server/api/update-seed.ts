import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    type: "Singles" | "Doubles"
    rank: string
  }
  const { id, type, rank } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (f:Entry:$($type) {id: $id})-[t:SEEDED|Q_SEEDED]->(e:Event)
      SET t.rank = toInteger($rank)
      RETURN f
    `,
    {
      id,
      type,
      rank: int(rank)
    }
  )

  return summary
})
