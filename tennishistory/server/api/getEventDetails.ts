export default defineEventHandler(async (query) => {
    const { eid } = getQuery<{ eid: string }>(query);

    const { records } = await useDriver().executeQuery(
        `
        MATCH (s:Surface)<-[:ON_SURFACE]-(e:Event {id: $id})-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        OPTIONAL MATCH (e)<-[:SUPERVISED]-(sup:Supervisor)
        WITH DISTINCT(e), s, v, c, collect(sup.id) as supervisors
        RETURN {
          supervisors: supervisors,
          surface: s.id,
          venue: v.name,
          city: v.city,
          country: c.id,
          category: e.category,
          draw: e.draw_type,
          dates: CASE
            WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          END,
          tfc: apoc.number.format(e.tfc, '#,###'),
          pm: apoc.number.format(e.pm, '#,###'),
          currency: e.currency,
          ename: e.sponsor_name
        } as event
      `,
        { id: parseInt(eid) }
    );

    const event = records.map((record) => record.toObject());

    return event[0].event;
});
