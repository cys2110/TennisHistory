import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  const { id, type, rank } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (f:Entry:$($type) {id: $id})-[t:LDA|Q_LDA]->(e:Event)
      SET t.rank = $rank
      RETURN f
    `,
    {
      id,
      type,
      rank: rank ? int(rank as string) : null
    }
  )

  return summary
})
