export default defineEventHandler(async (event) => {
  const { surface, month, category } = getQuery(event);

  const formattedParams = {
    surface: surface === "All" ? null : surface,
    month: month === "All" ? null : parseInt(month),
    category: category === "All" ? null : category,
  };
  const { records } = await useDriver().executeQuery(
    `
        MATCH (e:Event)-[:ON_SURFACE]->(s:Surface)
        MATCH (t:Tournament)<-[:EDITION_OF]-(e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        WHERE
          e.end_date >= date() AND
          ($surface IS NULL OR s.surface = $surface)
          AND ($month IS NULL OR e.start_date.month = $month)
          AND ($category IS NULL OR e.category = $category)
        WITH e, s, t, v, c
        ORDER BY e.start_date
        WITH {surface: s.id, tid: t.id, tname: t.name, city: v.city, country: c.id, start_date: e.start_date, eid: e.id, end_date: e.end_date, category: e.category, currency: e.currency, ename: e.sponsor_name} as event
        RETURN COLLECT(event) as events
      `,
    formattedParams
  );

  const events = records.map((record) => record.toObject());

  return events[0].events;
});
