export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  // TODO: Remove WHERE t.name IS NOT NULL
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event)-[:TOOK_PLACE_IN]->(v:Venue {id: $id})-[:LOCATED_IN]->(c:Country)
      MATCH (e)-[:IN_YEAR]->(y:Year)
      MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament) WHERE t.name IS NOT NULL
      WITH y, e, t, s, v, c
        ORDER BY e.start_date
      WITH y, e, t, s, COLLECT({id: v.id, name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues
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
      } AS event
    `,
    { id }
  )

  const results = records.map(record => record.get("event"))

  return results
})
