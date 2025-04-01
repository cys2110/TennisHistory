export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
  }

  const { id } = getQuery<QueryProps>(query)

  // TODO: Remove WHERE t.name IS NOT NULL
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Supervisor {id: $id})-[:SUPERVISED]->(e:Event)-[:IN_YEAR]->(y:Year)
      MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament) WHERE t.name IS NOT NULL
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH y, e, t, s, v, c
        ORDER BY e.start_date
      WITH y, e, t, s, COLLECT({name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues
      RETURN {
        year: toString(y.id),
        surface: s.surface,
        tid: toString(t.id),
        eid: toString(e.id),
        name: t.name,
        ename: e.sponsor_name,
        category: e.category,
        locations: venues,
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
