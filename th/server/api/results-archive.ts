import { CategoryEnum, MonthEnum, SurfaceEnum } from "~/utils/enums"

export default defineEventHandler(async query => {
  interface QueryProps {
    surfaces: SurfaceEnum[]
    categories: CategoryEnum[]
    year: string
    months: keyof (typeof MonthEnum)[][]
    upcoming: "upcoming" | "archive"
  }

  const { surfaces, categories, year, months, upcoming } = getQuery<QueryProps>(query)
  const monthArray = months ? (Array.isArray(months) ? months : [months]) : []

  // Ensure that all params are arrays
  const formattedParams = {
    surfaces: surfaces ? (Array.isArray(surfaces) ? surfaces : [surfaces]) : [],
    months: monthArray.map(month => MonthEnum[month]),
    categories: categories ? (Array.isArray(categories) ? categories : [categories]) : [],
    year: Number(year),
    upcoming: upcoming === "archive" ? false : true
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year {id: $year})<-[:IN_YEAR]-(e:Event)-[:EDITION_OF]->(t:Tournament)
        WHERE ($upcoming = false OR e.end_date >= date())
        AND ($months = [] OR e.start_date.month IN $months)
        AND ($categories = [] OR e.category IN $categories)
      MATCH (e)-[:ON_SURFACE]->(s:Surface) WHERE ($surfaces = [] OR s.surface IN $surfaces)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH y, e, t, s, v, c
        ORDER BY e.start_date
      WITH y, e, t, s, COLLECT({id: v.id,name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues
      RETURN {
        year: toString(y.id),
        surface: s.surface,
        tid: toString(t.id),
        eid: toString(e.id),
        name: t.name,
        ename: e.sponsor_name,
        category: e.category,
        venues: venues,
        start: apoc.temporal.format(e.start_date, 'yyyy-MM-dd'),
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
        END,
        draw_type: e.draw_type
      } AS event
    `,
    formattedParams
  )

  const results = records.map(record => record.get("event"))

  return results
})
