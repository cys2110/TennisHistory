export default defineEventHandler(async event => {
  const { year } = getQuery<{ year: string }>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (y:Year {id: $year})<-[:IN_YEAR]-(e:Event)
      WITH labels(e) AS tours, [e.category, e.atp_category, e.wta_category, e.men_category, e.women_category] AS categories
      RETURN [x IN tours WHERE NOT x IN ['Update', 'Event']] AS tours, [x IN categories WHERE x IS NOT NULL] AS categories
    `,
    { year: Number(year) }
  )

  return records.map(record => record.toObject())
})
