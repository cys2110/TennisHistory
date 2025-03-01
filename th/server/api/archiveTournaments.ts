import { CategoryEnum, MonthNameEnum, MonthNumberEnum, SurfaceEnum } from "~/utils/enums";

export default defineEventHandler(async(query) => {
  const { surfaces, months, categories, years } = getQuery<{surfaces: SurfaceEnum[], months: MonthNameEnum[], categories: CategoryEnum[], years: string[]}>(query);
  const monthArray = Array.isArray(months) ? months : [months];
  const monthNumbers = monthArray.map(month => MonthNumberEnum[month]);

  const formattedParams = {
      surface: Array.isArray(surfaces) ? surfaces : [surfaces],
      month: monthNumbers,
      category: Array.isArray(categories) ? categories : [categories],
      year: Array.isArray(years) ? years.map((y) => parseInt(y)) : [parseInt(years)]
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year)<-[:IN_YEAR]-(e:Event)-[:EDITION_OF]->(t:Tournament)
        WHERE NOT e:Update
        AND y.id IN $year
        AND e.start_date.month IN $month
        AND e.category IN $category
      OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        WHERE s.surface IN $surface
      WITH y, e, t, s, v, c
        ORDER BY e.start_date
      WITH {
        year: toString(toInteger(y.id)),
        surface: s.surface,
        tid: toString(t.id),
        eid: toString(e.id),
        name: t.name,
        ename: e.sponsor_name,
        category: e.category,
        city: v.city,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        start: apoc.temporal.format(e.start_date, 'yyyy-MM-dd'),
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date IS NOT NULL AND e.end_date IS NOT NULL THEN apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          ELSE NULL
        END
      } AS event
      RETURN COLLECT(event) AS events
    `, formattedParams)

  const results = records.map((record) => record.toObject());

  return results[0].events;
})
