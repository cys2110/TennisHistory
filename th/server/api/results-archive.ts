import { MONTHS_SERVER } from "../utils/variables"

export default defineEventHandler(async query => {
  interface QueryProps {
    surfaces: SurfaceType[]
    categories: CategoryType[]
    year: string
    months: MonthType[]
    upcoming: string
    environment: EnvironmentType | undefined
    tour: TourType | undefined
  }

  const { surfaces, categories, year, months, upcoming, environment, tour } = getQuery<QueryProps>(query)

  const monthArray =
    months ?
      Array.isArray(months) ?
        months
      : [months]
    : []

  // Ensure that all params are arrays
  const formattedParams = {
    surfaces:
      surfaces ?
        Array.isArray(surfaces) ?
          surfaces
        : [surfaces]
      : [],
    environment: environment ?? null,
    months: monthArray.map(month => MONTHS_SERVER[month]), // Convert month names to numbers (1-12)
    categories:
      categories ?
        Array.isArray(categories) ?
          categories
        : [categories]
      : [],
    year: Number(year),
    upcoming: upcoming === "false" ? false : true,
    tour:
      tour === "ITF - Men's" ? "Men"
      : tour === "ITF - Women's" ? "Women"
      : (tour ?? null)
  }

  // TODO: Remove start date guards
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (y:Year {id: $year})<-[:IN_YEAR]-(e:Event)-[:EDITION_OF]->(t:Tournament)
    OPTIONAL MATCH (e)-[:ON_SURFACE]->(s:Surface)
    OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
    WITH
      DISTINCT *,
      apoc.coll.min([e.start_date, e.atp_start_date, e.wta_start_date]) AS start_date
    WHERE
      (e.start_date IS NOT NULL OR e.atp_start_date IS NOT NULL OR e.wta_start_date IS NOT NULL) AND
      ($upcoming = false OR e.end_date >= date() OR e.atp_end_date >= date() OR e.wta_end_date >= date()) AND
      ($months = [] OR e.start_date.month IN $months) AND
      ($categories = [] OR e.category IN $categories) AND
      ($tour IS NULL OR $tour IN labels(e)) AND
      ($surfaces = [] OR (s IS NOT NULL AND s.surface IN $surfaces)) AND
      ($environment IS NULL OR (s IS NOT NULL AND s.environment = $environment))
    ORDER BY start_date
    WITH
      y,
      e,
      t,
      s,
      start_date,
      COLLECT(
        CASE
          WHEN
            v IS NOT NULL
            THEN
              {
                id: v.id,
                name: v.name,
                city: v.city,
                country: {id: c.id, name: c.name, alpha2: c.alpha2}
              }
          ELSE null
        END
      ) AS venues,
      CASE
        WHEN s IS NULL THEN null
        ELSE {id: s.id, environment: s.environment, surface: s.surface}
      END AS surface
    RETURN
      CASE
        WHEN
          e IS NOT NULL
          THEN
            {
              tours: labels(e),
              id: e.id,
              name: e.sponsor_name,
              tournament: {id: t.id, name: t.name},
              year: y.id,
              category: e.category,
              atp_category: e.atp_category,
              wta_category: e.wta_category,
              start_date: apoc.temporal.format(start_date, 'yyyy-MM-dd'),
              dates:
                CASE
                  WHEN e.start_date IS NULL OR e.end_date IS NULL THEN null
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
              atp_dates:
                CASE
                  WHEN e.atp_start_date IS NULL OR e.atp_end_date IS NULL THEN null
                  WHEN
                    e.atp_start_date.year <> e.atp_end_date.year
                    THEN
                      apoc.temporal.format(e.atp_start_date, 'dd MMMM yyyy') ||
                      ' - ' ||
                      apoc.temporal.format(e.atp_end_date, 'dd MMMM yyyy')
                  WHEN
                    e.atp_start_date.month <> e.atp_end_date.month
                    THEN
                      apoc.temporal.format(e.atp_start_date, 'dd MMMM') ||
                      ' - ' ||
                      apoc.temporal.format(e.atp_end_date, 'dd MMMM yyyy')
                  ELSE
                    apoc.temporal.format(e.atp_start_date, 'dd') ||
                    ' - ' ||
                    apoc.temporal.format(e.atp_end_date, 'dd MMMM yyyy')
                END,
              wta_dates:
                CASE
                  WHEN e.wta_start_date IS NULL OR e.wta_end_date IS NULL THEN null
                  WHEN
                    e.wta_start_date.year <> e.wta_end_date.year
                    THEN
                      apoc.temporal.format(e.wta_start_date, 'dd MMMM yyyy') ||
                      ' - ' ||
                      apoc.temporal.format(e.wta_end_date, 'dd MMMM yyyy')
                  WHEN
                    e.wta_start_date.month <> e.wta_end_date.month
                    THEN
                      apoc.temporal.format(e.wta_start_date, 'dd MMMM') ||
                      ' - ' ||
                      apoc.temporal.format(e.wta_end_date, 'dd MMMM yyyy')
                  ELSE
                    apoc.temporal.format(e.wta_start_date, 'dd') ||
                    ' - ' ||
                    apoc.temporal.format(e.wta_end_date, 'dd MMMM yyyy')
                END,
              surface: surface,
              venues: venues
            }
        ELSE null
      END AS event
    `,
    formattedParams
  )

  const results = records.map(record => record.get("event")).filter(Boolean)

  // Convert Neo4j types to standard JavaScript types
  const events = results.filter(Boolean).map(event => ({
    ...event,
    tours: event.tours.filter((tour: string) => tour !== "Event"),
    id: event.id.low,
    year: event.year.low,
    venues: event.venues.filter(Boolean),
    tournament: {
      ...event.tournament,
      id: event.tournament.id.low
    }
  }))

  return events
})
