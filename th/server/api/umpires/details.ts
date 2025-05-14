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
      MATCH (u:Umpire {id: $id})-[:UMPIRED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year {id: $year})
      MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament)
      WHERE
        ($months = [] OR e.start_date.month IN $months) AND
        ($categories = [] OR e.category IN $categories) AND
        t.name IS NOT NULL AND
        ($surfaces = [] OR s.surface IN $surfaces) AND
        ($environment = [] OR s.environment IN $environment)
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      MATCH (p1:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:P1)-[:SCORED]->(m)<-[:SCORED]-(:P2)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2:Player)
      WITH *
        ORDER BY ${sortOption}, r.number DESC, m.match_no ASC
      CALL (p1, e) {
        MATCH (p1)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p1)-[c2:REPRESENTED]->(c3:Country)
        RETURN CASE
          WHEN c2 IS NOT NULL AND c2.start_date <= e.start_date AND c2.end_date > e.start_date THEN {id: c3.id, name: c3.name, alpha2: c3.alpha2}
          ELSE {id: c.id, name: c.name, alpha2: c.alpha2}
        END AS c1
      }
      CALL (p2, e) {
        MATCH (p2)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p2)-[c3:REPRESENTED]->(c4:Country)
        RETURN CASE
          WHEN c3 IS NOT NULL AND c3.start_date <= e.start_date AND c3.end_date > e.start_date THEN {id: c4.id, name: c4.name, alpha2: c4.alpha2}
          ELSE {id: c.id, name: c.name, alpha2: c.alpha2}
        END AS c2
      }
      WITH {
        match_no: toString(m.match_no),
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
        date: apoc.temporal.format(m.date, 'dd MMMM yyyy')
      } AS match,
        r,
        t,
        e,
        y,
        u,
        s,
        COLLECT(
          {
            id: v.id,
            name: v.name,
            city: v.city,
            country: {id: c.id, name: c.name, alpha2: c.alpha2}
          }
        ) AS venues
      WITH r, t, e, s, COLLECT(match) AS matches, y, u, venues
      WITH t, e, y, u, s, {
        round: r.round,
        matches: matches
      } AS round, venues
      WITH t, e, COLLECT(round) AS rounds, y, u, venues, s
      WITH COLLECT({
        id: toString(e.id),
        tournament: {id: toString(t.id), name: t.name},
        surface: {id: s.id, surface: s.surface},
        category: e.category,
        venues: venues,
        draw_type: e.draw_type,
        year: toString(y.id),
        rounds: rounds,
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
          END
      }) AS events, labels(u) AS labels
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
