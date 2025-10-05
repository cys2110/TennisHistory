export default defineEventHandler(async event => {
  const { id, tour } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MERGE (p:Player:$($tour) {id: $id})
    `,
    {
      id,
      tour
    }
  )

  return summary
})
