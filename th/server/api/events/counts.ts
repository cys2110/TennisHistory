export default defineEventHandler(async query => {
  const { year } = getQuery<{ year: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (y:Year {id: $year})<-[:IN_YEAR]-(e:Event)
      OPTIONAL MATCH (y)<-[:IN_YEAR]-(w:WTA:Event)
      OPTIONAL MATCH (y)<-[:IN_YEAR]-(a:ATP:Event)
      OPTIONAL MATCH (y)<-[:IN_YEAR]-(im:ITF:Men:Event)
      OPTIONAL MATCH (y)<-[:IN_YEAR]-(iw:ITF:Women:Event)
      RETURN {
        wta: COUNT(DISTINCT w),
        atp: COUNT(DISTINCT a),
        itf_men: COUNT(DISTINCT im),
        itf_women: COUNT(DISTINCT iw),
        total: COUNT(DISTINCT e)
      } AS counts
    `,
    { year: Number(year) }
  )

  const results = records[0].get("counts")

  return {
    wta: results.wta.low,
    atp: results.atp.low,
    itf_men: results.itf_men.low,
    itf_women: results.itf_women.low,
    total: results.total.low
  }
})
