export default defineEventHandler(async event => {
  const { id, type, rank } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (f:Entry:$($type) {id: $id})-[t:LDA|Q_LDA]->(e:Event)
      SET t.rank = toInteger($rank)
      RETURN f
    `,
    {
      id,
      type,
      rank
    }
  )

  return summary
})
