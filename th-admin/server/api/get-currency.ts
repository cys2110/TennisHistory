export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})
      RETURN
        CASE
          WHEN e.currency IS NOT NULL THEN e.currency
          WHEN e.atp_currency IS NOT NULL THEN e.atp_currency
          WHEN e.wta_currency IS NOT NULL THEN e.wta_currency
          WHEN e.men_currency IS NOT NULL THEN e.men_currency
          ELSE e.women_currency
        END AS currency
    `,
    { id }
  )

  return records[0]?.get("currency") || "USD"
})
