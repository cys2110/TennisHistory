export default defineEventHandler(async query => {
  const { id, year } = getQuery<{ id: string; year: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (x:Supervisor {id: $id})-[:SUPERVISED]->(e:Event)-[:IN_YEAR]->(y:Year {id: $year})
      MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament)
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH y, e, t, s, v, c, x
        ORDER BY e.start_date
      WITH y, e, t, s, x, COLLECT({id: v.id, name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues
      RETURN {
        year: toString(y.id),
        surface: s.surface,
        tid: toString(t.id),
        eid: toString(e.id),
        name: t.name,
        ename: e.sponsor_name,
        category: e.category,
        venues: venues,
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
        END,
        draw_type: e.draw_type
      } AS event, labels(x) AS labels
    `,
    { id, year: Number(year) }
  )

  const results = records.map(record => record.get("event"))
  const labels = records[0].get("labels")

  return { results, labels }
})
