export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    year: string
    environment: EnvironmentType
    surfaces: SurfaceType[]
    months: MonthType[]
  }

  const { id, surfaces, year, months, environment } = getQuery<QueryProps>(query)

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
    year: Number(year),
    id
  }

  // TODO: Remove start date guard
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (t:Tournament)<-[:EDITION_OF]-(e:Event)-[:IN_YEAR]->(y:Year)
    OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)
    OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
    WITH
      DISTINCT *,
      apoc.coll.min([e.start_date, e.atp_start_date, e.wta_start_date]) AS start_date
     WHERE
      (e.start_date IS NOT NULL OR e.atp_start_date IS NOT NULL OR e.wta_start_date IS NOT NULL) AND
      ($year IS NULL OR y.id = $year) AND
      ($months = [] OR e.start_date.month IN $months) AND
      $id IN [e.category, e.atp_category, e.wta_category] AND
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
            v IS NULL
              THEN null
          ELSE
            {
              id: v.id,
              name: v.name,
              city: v.city,
              country: {id: c.id, name: c.name, alpha2: c.alpha2}
            }
        END
      ) AS venues,
      CASE
        WHEN s IS NULL THEN null
        ELSE {id: s.id, environment: s.environment, surface: s.surface}
      END AS surface
      RETURN {
        tours: labels(e),
        year: y.id,
        surface: surface,
        id: e.id,
        name: e.sponsor_name,
        category: e.category,
        atp_category: e.atp_category,
        wta_category: e.wta_category,
        venues: venues,
        start_date: apoc.temporal.format(start_date, 'yyyy-MM-dd'),
        dates:
          CASE
            WHEN e.start_date IS NULL OR e.end_date IS NULL THEN NULL
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
          WHEN e.atp_start_date IS NULL OR e.atp_end_date IS NULL THEN NULL
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
          WHEN e.wta_start_date IS NULL OR e.wta_end_date IS NULL THEN NULL
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
        tournament: {id: t.id, name: t.name}
      } AS event
    `,
    formattedParams
  )

  const results = records.map(record => record.get("event"))

  // Convert Neo4j types to standard JavaScript types
  const events = results.map(event => ({
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
