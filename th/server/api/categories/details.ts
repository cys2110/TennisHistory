import { CategoryEnum, MonthEnum, SurfaceEnum } from "../../../utils/enums"

export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    year: string
    skip: string
    tournamentSort: "ASC" | "DESC" | undefined
    dateSort: "ASC" | "DESC" | undefined
    surfaceSort: "ASC" | "DESC" | undefined
    environment: ("Indoor" | "Outdoor")[]
    surfaces: SurfaceEnum[]
    months: keyof (typeof MonthEnum)[][]
  }

  const { id, surfaces, year, months, environment, skip, tournamentSort, dateSort, surfaceSort } = getQuery<QueryProps>(query)

  const monthArray = months ? (Array.isArray(months) ? months : [months]) : []

  // Ensure that all params are arrays
  const formattedParams = {
    surfaces: surfaces ? (Array.isArray(surfaces) ? surfaces : [surfaces]) : [],
    environment: environment ? (Array.isArray(environment) ? environment : [environment]) : [],
    months: monthArray.map(month => MonthEnum[month]),
    year: Number(year),
    skip,
    id
  }

  // Sort options
  const sortOption = tournamentSort
    ? `t.name ${tournamentSort}, e.start_date`
    : surfaceSort
    ? `s.surface ${surfaceSort}, e.start_date`
    : `e.start_date ${dateSort ?? "ASC"}`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (e:Event {category: $id})-[:IN_YEAR]->(y:Year)
    WHERE
      ($year IS NULL OR y.id = $year) AND
      ($months = [] OR e.start_date.month IN $months)
    MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament)
    WHERE
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
      COLLECT(
        {
          id: v.id,
          name: v.name,
          city: v.city,
          country: {id: c.id, name: c.name, alpha2: c.alpha2}
        }
      ) AS venues
    WITH
      COLLECT(
        {
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
        }
      ) AS events
    WITH
      SIZE(events) AS count,
      events[toInteger($skip) .. toInteger($skip) + 25] AS events
    RETURN toString(count) AS count, events
    `,
    formattedParams
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    events: results.events.filter(Boolean)
  }
})
