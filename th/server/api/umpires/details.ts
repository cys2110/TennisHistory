export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    year: string | undefined
    surfaces: SurfaceType[]
    categories: CategoryType[]
    months: MonthType[]
    environment: EnvironmentType | undefined
    player: string | undefined
    tour: TourType | undefined
  }

  const { id, surfaces, categories, year, months, environment, player, tour } = getQuery<QueryProps>(query)

  const monthArray =
    months ?
      Array.isArray(months) ?
        months
      : [months]
    : []

  // Ensure that all params are arrays
  const formattedParams = {
    id,
    surfaces:
      surfaces ?
        Array.isArray(surfaces) ?
          surfaces
        : [surfaces]
      : [],
    environment: environment ?? null,
    months: monthArray.map(month => MONTHS_SERVER[month]), // Convert month names to numbers (1-12),
    categories:
      categories ?
        Array.isArray(categories) ?
          categories
        : [categories]
      : [],
    year: year ? Number(year) : null,
    player: player ?? null,
    tour:
      tour === "ITF - Men's" ? "Men"
      : tour === "ITF - Women's" ? "Women"
      : (tour ?? null)
  }

  // TODO: Remove start date guard
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:Umpire {id: $id})-[:UMPIRED]->(m:Singles|Doubles)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year)
      OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      MATCH (p1:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:P1)-[:SCORED]->(m)<-[:SCORED]-(:P2)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2:Player)
      WHERE $player IS NULL OR p1.id = $player OR p2.id = $player
      WITH
        DISTINCT *,
        apoc.coll.min([e.start_date, e.atp_start_date, e.wta_start_date]) AS start_date
      WHERE
        (e.start_date IS NOT NULL OR e.atp_start_date IS NOT NULL OR e.wta_start_date IS NOT NULL) AND
        ($year IS NULL OR y.id = $year) AND
        ($tour IS NULL OR $tour IN labels(e)) AND
        ($months = [] OR e.start_date.month IN $months) AND
        ($categories = [] OR e.category IN $categories) AND
        ($surfaces = [] OR (s IS NOT NULL AND s.surface IN $surfaces)) AND
        ($environment IS NULL OR (s IS NOT NULL AND s.environment = $environment))
      ORDER BY start_date, r.number DESC, m.match_no ASC
      CALL (p1, e) {
        MATCH (p1)-[:REPRESENTS]->(cz:Country)
        OPTIONAL MATCH (p1)-[c2:REPRESENTED]->(c3:Country)
        RETURN CASE
          WHEN c2 IS NOT NULL AND c2.start_date <= e.start_date AND c2.end_date > e.start_date THEN {id: c3.id, name: c3.name, alpha2: c3.alpha2}
          ELSE {id: cz.id, name: cz.name, alpha2: cz.alpha2}
        END AS c1
      }
      CALL (p2, e) {
        MATCH (p2)-[:REPRESENTS]->(cz:Country)
        OPTIONAL MATCH (p2)-[c3:REPRESENTED]->(c4:Country)
        RETURN CASE
          WHEN c3 IS NOT NULL AND c3.start_date <= e.start_date AND c3.end_date > e.start_date THEN {id: c4.id, name: c4.name, alpha2: c4.alpha2}
          ELSE {id: cz.id, name: cz.name, alpha2: cz.alpha2}
        END AS c2
      }
      WITH {
        match_no: m.match_no,
        p1: {
          id: p1.id,
          name: p1.first_name || ' ' || p1.last_name,
          country: c1
        },
        p2: {
          id: p2.id,
          name: p2.first_name || ' ' || p2.last_name,
          country: c2
        },
        date: CASE WHEN m.date IS NOT NULL THEN apoc.temporal.format(m.date, 'dd MMMM yyyy') ELSE NULL END,
        type: labels(m)
      } AS match,
        r,
        t,
        e,
        y,
        u,
        COLLECT(CASE WHEN v IS NULL THEN null ELSE
          {
            id: v.id,
            name: v.name,
            city: v.city,
            country: {id: c.id, name: c.name, alpha2: c.alpha2}
          }
        END) AS venues,
        CASE WHEN s IS NULL THEN null ELSE {id: s.id, environment: s.environment, surface: s.surface} END AS surface
      WITH r, t, e, surface, COLLECT(match) AS matches, y, u, venues
      WITH t, e, y, u, surface, {
        round: r.round,
        matches: matches
      } AS round, venues
      WITH t, e, COLLECT(round) AS rounds, y, u, venues, surface
      RETURN CASE WHEN e IS NOT NULL THEN {
        tours: labels(e),
        id: e.id,
        tournament: {id: t.id, name: t.name},
        surface: surface,
        category: e.category,
        atp_category: e.atp_category,
        wta_category: e.wta_category,
        venues: venues,
        year: y.id,
        rounds: rounds,
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
        END
      } ELSE null END AS event, labels(u) AS labels
    `,
    formattedParams
  )

  const results = records.map(record => record.get("event")).filter(Boolean)
  const labels = records[0].get("labels")

  const events = results.filter(Boolean).map(event => ({
    ...event,
    tours: event.tours.filter((tour: any) => tour !== "Event" && tour !== "Update"),
    id: event.id.low,
    year: event.year.low,
    venues: event.venues.filter(Boolean),
    tournament: {
      ...event.tournament,
      id: event.tournament.id.low
    },
    rounds: event.rounds.map((round: any) => ({
      ...round,
      matches: round.matches.map((m: any) => ({
        ...m,
        match_no: m.match_no?.low
      }))
    }))
  }))

  return { events, labels }
})
