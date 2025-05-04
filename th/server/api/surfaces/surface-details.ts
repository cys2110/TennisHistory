export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    year: string
  }

  const { id, year } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface {id: $id})<-[:ON_SURFACE]-(e:Event)-[:IN_YEAR]->(y:Year {id: $year})
      MATCH (e)-[:EDITION_OF]->(t:Tournament)
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH y, e, t, s, v, c
        ORDER BY e.start_date
      WITH y, e, t, s, COLLECT({id: v.id, name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues
      RETURN {
        year: toString(y.id),
        surface: {
          id: s.id,
          surface: s.surface
        },
        id: toString(e.id),
        name: e.sponsor_name,
        category: e.category,
        venues: venues,
        start_date: apoc.temporal.format(e.start_date, 'yyyy-MM-dd'),
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
        END,
        draw_type: e.draw_type,
        tournament: {
          id: toString(t.id),
          name: t.name
        }
      } AS event
    `,
    { id, year: Number(year) }
  )

  const results = records.map(record => record.get("event"))

  return results
})
