import { CategoryEnum, MonthNameEnum, SurfaceEnum } from "~/types/enums";
import { MONTHS } from "~/utils/variables";

export default defineEventHandler(async(query) => {
  const { surfaces, months, categories, years } = getQuery<{surfaces: SurfaceEnum[], months: MonthNameEnum[], categories: CategoryEnum[], years: string[]}>(query);

  const monthArray = Array.isArray(months) ? months : [months];
  const monthNumbers = monthArray.map(month => MONTHS[month]);

  const formattedParams = {
      surface: Array.isArray(surfaces) ? surfaces : [surfaces],
      month: monthNumbers,
      category: Array.isArray(categories) ? categories : [categories],
      year: Array.isArray(years) ? years.map((y) => parseInt(y)) : [parseInt(years)]
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year)<-[:TOOK_PLACE_IN]-(e:Event)-[:ON_SURFACE]->(s:Surface)
      MATCH (t:Tournament)<-[:EDITION_OF]-(e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WHERE
        y.id IN $year
        AND s.surface IN $surface
        AND e.start_date.month IN $month
        AND e.category IN $category
      WITH e, s, t, v, c, y
      ORDER BY e.start_date
      WITH {
        year: toString(y.id),
        surface: s.surface,
        tid: toString(t.id),
        name: t.name,
        city: v.city,
        country: c.id,
        start: apoc.temporal.format(e.start_date, 'yyyy-MM-dd'),
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date IS NOT NULL AND e.end_date IS NOT NULL THEN apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          ELSE NULL
        END,
        eid: toString(e.id),
        category: e.category,
        ename: e.sponsor_name
      } as event
      RETURN COLLECT(event) as events
    `, formattedParams
  )

  const results = records.map((record) => record.toObject());

  return results[0].events;
})
