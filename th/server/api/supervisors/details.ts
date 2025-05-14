import { CategoryEnum, MonthEnum, SurfaceEnum } from "../../../utils/enums"

export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    year: string
    surfaces: SurfaceEnum[]
    categories: CategoryEnum[]
    months: keyof (typeof MonthEnum)[][]
    upcoming: string
    environment: ("Indoor" | "Outdoor")[]
    skip: string
    tournamentSort: "ASC" | "DESC" | undefined
    categorySort: "ASC" | "DESC" | undefined
    dateSort: "ASC" | "DESC" | undefined
    surfaceSort: "ASC" | "DESC" | undefined
  }

  const { id, surfaces, categories, year, months, upcoming, environment, skip, tournamentSort, categorySort, dateSort, surfaceSort } =
    getQuery<QueryProps>(query)

  const monthArray = months ? (Array.isArray(months) ? months : [months]) : []

  // Ensure that all params are arrays
  const formattedParams = {
    id,
    surfaces: surfaces ? (Array.isArray(surfaces) ? surfaces : [surfaces]) : [],
    environment: environment ? (Array.isArray(environment) ? environment : [environment]) : [],
    months: monthArray.map(month => MonthEnum[month]),
    categories: categories ? (Array.isArray(categories) ? categories : [categories]) : [],
    year: Number(year),
    upcoming: upcoming === "false" ? false : true,
    skip
  }

  // Sort options
  const sortOption = tournamentSort
    ? `t.name ${tournamentSort}, e.start_date`
    : categorySort
    ? `e.category ${categorySort}, e.start_date`
    : surfaceSort
    ? `s.surface ${surfaceSort}, e.start_date`
    : `e.start_date ${dateSort ?? "ASC"}`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (x:Supervisor {id: $id})-[:SUPERVISED]->(e:Event)-[:IN_YEAR]->(y:Year {id: $year})
      WHERE
        ($months = [] OR e.start_date.month IN $months) AND
        ($categories = [] OR e.category IN $categories)
      MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament) WHERE
        t.name IS NOT NULL AND
        ($surfaces = [] OR s.surface IN $surfaces) AND
        ($environment = [] OR s.environment IN $environment)
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH *
        ORDER BY ${sortOption}
      WITH
        y,
        e,
        t,
        s,
        x,
        COLLECT(
          {
            id: v.id,
            name: v.name,
            city: v.city,
            country: {id: c.id, name: c.name, alpha2: c.alpha2}
          }
        ) AS venues
      WITH COLLECT({
        year: toString(y.id),
        surface: {id: s.id, surface: s.surface},
        id: toString(e.id),
        name: e.sponsor_name,
        category: e.category,
        venues: venues,
        start_date: apoc.temporal.format(e.start_date, 'yyyy-MM-dd'),
        dates:
          CASE
            WHEN
              e.start_date.year <> e.end_date.year
              THEN
                apoc.temporal.format(e.start_date, 'dd MMMM yyyy') ||
                ' - ' ||
                apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            WHEN
              e.start_date.month <> e.end_date.month
              THEN
                apoc.temporal.format(e.start_date, 'dd MMMM') ||
                ' - ' ||
                apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            ELSE
              apoc.temporal.format(e.start_date, 'dd') ||
              ' - ' ||
              apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          END,
        draw_type: e.draw_type,
        tournament: {id: toString(t.id), name: t.name}
      }) AS events, labels(x) AS labels
      WITH SIZE(events) AS count, events[toInteger($skip)..toInteger($skip) + 25] AS events, labels
      RETURN toString(count) AS count, events, labels
    `,
    formattedParams
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    labels: results.labels,
    events: results.events.filter(Boolean)
  }
})
