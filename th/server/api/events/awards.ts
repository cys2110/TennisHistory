export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (e:Event {id: $id})<-[:ROUND_OF]-(r:Round)
    WITH
      r,
      e,
      CASE
        WHEN r:Singles THEN 'Singles'
        ELSE 'Doubles'
      END AS type,
      CASE
        WHEN r:ATP THEN 'ATP'
        WHEN r:WTA THEN 'WTA'
        WHEN r:Men THEN 'ITF (M)'
        ELSE 'ITF (W)'
      END AS tour
    ORDER BY tour, type DESC, r.number
    WITH r, type, tour, CASE tour WHEN 'ATP' THEN e.atp_currency WHEN 'WTA' THEN e.wta_currency WHEN 'ITF (M)' THEN e.men_currency ELSE e.women_currency END AS currency
    RETURN
      apoc.map.merge(properties(r), {currency: currency, type: type, tour: tour}) AS round
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
