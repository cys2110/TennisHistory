export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})<-[:ROUND_OF]-(r:Round)
      WITH r, e
        ORDER BY r.number
      RETURN {
        round: r.round,
        pm: apoc.number.format(r.pm, '#,###'),
        points: apoc.number.format(r.points, '#,###'),
        currency: e.currency
      } AS round
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.get("round"))

  return results
})
