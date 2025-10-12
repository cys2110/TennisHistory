import { int, isInt } from "neo4j-driver"

export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (r:Round)-[:ROUND_OF]->(e:Event {id: $id})
      WITH
        CASE WHEN r:Singles THEN 'Singles' ELSE 'Doubles' END AS type,
        CASE WHEN r:Main THEN 'Main' ELSE 'Qualifying' END AS draw,
        CASE WHEN r:ATP THEN 'ATP' WHEN r:WTA THEN 'WTA' WHEN r:Men THEN 'Men' ELSE 'Women' END AS tour,
        properties(r) AS round,
        CASE
          WHEN e.currency IS NOT NULL THEN e.currency
          WHEN r:ATP THEN e.atp_currency
          WHEN r:WTA THEN e.wta_currency
          WHEN r:Men THEN e.men_currency
          ELSE e.women_currency
        END AS currency
      RETURN DISTINCT apoc.map.merge(round, {tour: tour, draw: draw, type: type, currency: currency}) AS round
      ORDER BY round.tour, round.type DESC, round.draw, round.number
    `,
    { id: int(id) }
  )

  const rounds = records.map(record => {
    const round = record.get("round")
    const numberKeys = ["points", "number", "pm"]

    for (const key of numberKeys) {
      if (round[key]) round[key] = isInt(round[key]) ? round[key]?.toInt() : round[key]
    }

    return round
  })

  return rounds
})
