export default defineEventHandler(async (query) => {
  const { eid } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (s:Surface)<-[:ON_SURFACE]-(e:Event {id: $id})-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        OPTIONAL MATCH (e)<-[:SUPERVISED]-(sup:Supervisor)
        WITH DISTINCT(e), s, v, c, collect(sup.id) as supervisors
        RETURN {supervisor: supervisors, surface: s.id, venue: v.name, city: v.city, country: c.id, category: e.category, draw: e.draw_type, start: e.start_date, end: e.end_date, tfc: e.tfc, pm: e.pm, currency: e.currency, ename: e.sponsor_name} as event
      `,
    { id: parseInt(eid) }
  );

  const event = records.map((record) => record.toObject());

  return event[0].event;
});
