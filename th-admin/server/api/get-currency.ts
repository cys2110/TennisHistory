import { int } from "neo4j-driver"

export default defineEventHandler(async query => {
  const { id, tour } = getQuery<{ id: string; tour: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})
      RETURN
        CASE
          WHEN e.currency IS NOT NULL THEN e.currency
          WHEN $tour = 'ATP' AND e:ATP AND e.atp_currency IS NOT NULL THEN e.atp_currency
          WHEN $tour = 'WTA' AND e:WTA AND e.wta_currency IS NOT NULL THEN e.wta_currency
          WHEN e:Men THEN e.men_currency
          ELSE e.women_currency
        END AS currency
    `,
    { id: int(id), tour }
  )

  return records[0]?.get("currency") || "USD"
})
