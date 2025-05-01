export default defineEventHandler(async query => {
  const { eid } = getQuery<{ eid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface)<-[:ON_SURFACE]-(e:Event {id: $id})-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      MATCH (e)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (sup:Supervisor)-[:SUPERVISED]->(e)
      WITH DISTINCT(e), s, t, COLLECT(DISTINCT {id: v.id, name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues, COLLECT(sup.id) as supervisors
      RETURN {
        name: e.sponsor_name,
        category: e.category,
        surface: s.id,
        venues: venues,
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
        END,
        tfc: apoc.number.format(e.tfc, '#,###'),
        pm: apoc.number.format(e.pm, '#,###'),
        currency: e.currency,
        supervisors: supervisors
      } AS event
    `,
    { id: Number(eid) }
  )

  const results = records[0].get("event")

  return results
})
