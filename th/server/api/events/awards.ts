export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (e:Event {id: $id})<-[:ROUND_OF]-(r:Round)
    WITH r, e.currency AS currency
    ORDER BY r.number
    RETURN
      apoc.map.merge(
        apoc.any.properties(r),
        {currency: currency, labels: labels(r)}
      ) AS round
    `,
    { id: Number(id) }
  )

  const results = records.map(record => {
    const round = record.get("round")
    const numberKeys = ["pm", "points", "number"]
    for (const key of numberKeys) {
      if (round[key]) {
        round[key] = round[key].toInt()
      }
    }
    return round
  })

  return results
})
