export default defineEventHandler(async event => {
  interface QueryProps {
    skip: string
    countries: string[]
    categories?: string[]
    levels?: string[]
    supervisors?: string[]
    surfaces?: string[]
    tournaments?: string[]
    umpires?: string[]
    venues?: string[]
    dateRange: string
    tours: string[]
    environments?: string[]
  }
  const { tournaments, skip, umpires, supervisors, surfaces, categories, venues, countries, levels, dateRange, tours, environments } =
    getQuery<QueryProps>(event)

  const dateObject = JSON.parse(dateRange)

  const levelCategories = []

  if (levels?.includes("Tour")) levelCategories.push(TOUR_CATEGORIES)
  if (levels?.includes("Challenger")) levelCategories.push(CHALLENGER_CATEGORIES)
  if (levels?.includes("ITF")) levelCategories.push(ITF_CATEGORIES)

  const formattedParams = {
    skip: skip || 0,
    categories: categories ? (Array.isArray(categories) ? [categories] : [categories]) : null,
    tournaments: tournaments ? (Array.isArray(tournaments) ? tournaments : [tournaments]) : null,
    umpires: umpires ? (Array.isArray(umpires) ? umpires : [umpires]) : null,
    supervisors: supervisors ? (Array.isArray(supervisors) ? supervisors : [supervisors]) : null,
    surfaces: surfaces ? (Array.isArray(surfaces) ? surfaces : [surfaces]) : null,
    venues: venues ? (Array.isArray(venues) ? venues : [venues]) : null,
    countries: countries ? (Array.isArray(countries) ? countries : [countries]) : null,
    levels: levels ? levelCategories.flat() : null,
    environments: environments ? (Array.isArray(environments) ? environments : [environments]) : null,
    tours: tours
      ? Array.isArray(tours)
        ? tours.map(tour => tour.replace("ITF (M)", "Men").replace("ITF (W)", "Women"))
        : [(tours as string).replace("ITF (M)", "Men").replace("ITF (W)", "Women")]
      : null,
    start: dateObject.start ? `${dateObject.start.year}-${dateObject.start.month}-${dateObject.start.day}` : null,
    end: dateObject.end ? `${dateObject.end.year}-${dateObject.end.month}-${dateObject.end.day}` : null
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year)<-[:IN_YEAR]-
        (e:Event
          WHERE
          coalesce(
            e.start_date,
            e.atp_start_date,
            e.wta_start_date,
            e.men_start_date,
            e.women_start_date
          ) IS
          NOT
          NULL)-
          [:EDITION_OF]->
        (t:Tournament WHERE $tournaments IS NULL OR t.name IN $tournaments)
      OPTIONAL MATCH (sup:Supervisor)-[:SUPERVISED]->(e)
      OPTIONAL MATCH (e)-[:ON_SURFACE]->(s:Surface)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      OPTIONAL MATCH (u:Umpire)-[:UMPIRED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(e)
      WITH DISTINCT
        *,
        head(
          apoc.coll.sort(
            [
              x IN
              [
                e.start_date,
                e.atp_start_date,
                e.wta_start_date,
                e.men_start_date,
                e.women_start_date
              ]
              WHERE x IS NOT NULL
            ])) AS start_date
      ORDER BY start_date DESC, t.name
      WITH
      COLLECT(DISTINCT properties(u)) AS umpires,
      COLLECT(DISTINCT properties(sup)) AS supervisors,
      CASE WHEN COUNT(v) = 0 THEN [] ELSE COLLECT(DISTINCT apoc.map.merge(properties(v), {country: properties(c)})) END AS venues,
      properties(s) AS surface,
      properties(t) AS tournament,
      [x IN [e.category, e.atp_category, e.wta_category, e.men_category, e.women_category] WHERE x IS NOT NULL] AS categories,
      start_date,
      [x IN [e.end_date, e.atp_end_date, e.wta_end_date, e.men_end_date, e.women_end_date] WHERE x IS NOT NULL] AS end_date,
        apoc.map.submap(
          e,
          [
            'id',
            'start_date',
            'end_date',
            'atp_start_date',
            'atp_end_date',
            'wta_start_date',
            'wta_end_date',
            'men_start_date',
            'men_end_date',
            'women_start_date',
            'women_end_date',
            'category',
            'atp_category',
            'wta_category',
            'men_category',
            'women_category',
            'sponsor_name',
            'atp_draw_s',
            'atp_draw_d',
            'wta_draw_s',
            'wta_draw_d',
            'men_draw_s',
            'men_draw_d',
            'women_draw_s',
            'women_draw_d'
          ],
          null,
          false
        ) AS event,
        [x IN labels(e) WHERE NOT x IN ['Event', 'Update']] AS tours,
        y.id AS year
      WITH umpires, supervisors, venues, surface, tournament, event, year, tours, [x IN umpires | x.id] AS umpire_ids, [x IN supervisors | x.id] AS supervisor_ids, categories, [x IN venues | x.id] AS venue_ids, [x IN venues | x.country.id] AS country_ids, start_date, end_date
      WHERE ($umpires IS NULL OR ( size(umpire_ids) > 0 AND ANY(id IN $umpires WHERE id IN umpire_ids) ))
      AND ($supervisors IS NULL OR ( size(supervisor_ids) > 0 AND ANY(id IN $supervisors WHERE id IN supervisor_ids) ))
      AND ($surfaces IS NULL OR surface.surface IN $surfaces)
      AND ($environments IS NULL OR surface.environment IN $environments)
      AND ($categories IS NULL OR ANY(cat IN $categories WHERE cat IN categories))
      AND ($venues IS NULL OR ( size(venue_ids) > 0 AND ANY(id IN $venues WHERE id IN venue_ids) ))
      AND ($countries IS NULL OR ( size(country_ids) > 0 AND ANY(id IN $countries WHERE id IN country_ids) ))
      AND ($levels IS NULL OR ANY(level in $levels WHERE level IN categories))
      AND ($start IS NULL OR ANY(date IN start_date WHERE date >= date($start)))
      AND ($end IS NULL OR ANY(date IN end_date WHERE date <= date($end)))
      AND ($tours IS NULL OR size(tours) > 0 AND ANY(tour IN $tours WHERE tour IN tours))
      WITH
        COLLECT(
          apoc.map.clean(
            apoc.map.merge(
              event,
              {
                surface: surface,
                venues: venues,
                tournament: tournament,
                year: year,
                tours: tours,
                supervisors: supervisors,
                umpires: umpires
              }
            ),
            [],
            [null]
          )) AS events
      WITH SIZE(events) AS count, events
      UNWIND events AS event
      RETURN event, count
      SKIP toInteger($skip)
      LIMIT 40
    `,
    formattedParams
  )

  // Convert Neo4j types to standard JavaScript types
  const events = records.map(record => {
    const event: any = record.get("event")
    const dateKeys: (keyof typeof event)[] = [
      "start_date",
      "end_date",
      "atp_start_date",
      "atp_end_date",
      "wta_start_date",
      "wta_end_date",
      "men_start_date",
      "men_end_date",
      "women_start_date",
      "women_end_date"
    ]

    for (const key of dateKeys) {
      if (event[key]) {
        event[key] = {
          year: event[key].year?.toInt(),
          month: event[key].month?.toInt(),
          day: event[key].day?.toInt()
        }
      }
    }

    const {
      category,
      atp_category,
      wta_category,
      men_category,
      women_category,
      id,
      start_date,
      end_date,
      atp_start_date,
      atp_end_date,
      wta_start_date,
      wta_end_date,
      men_start_date,
      men_end_date,
      women_start_date,
      women_end_date,
      tours,
      atp_draw_s,
      atp_draw_d,
      wta_draw_s,
      wta_draw_d,
      men_draw_s,
      men_draw_d,
      women_draw_s,
      women_draw_d,
      tournament,
      year,
      ...rest
    } = event

    // level
    const levels = []

    if (
      category ||
      (atp_category && !ATP_CHALLENGER_CATEGORIES.includes(atp_category)) ||
      (wta_category && !WTA_CHALLENGER_CATEGORIES.includes(wta_category))
    )
      levels.push("Tour")

    if ((atp_category && ATP_CHALLENGER_CATEGORIES.includes(atp_category)) || (wta_category && WTA_CHALLENGER_CATEGORIES.includes(wta_category)))
      levels.push("Challenger")

    if (men_category || women_category) levels.push("ITF")

    return {
      id: id.toInt(),
      tours: getCorrectTours(tours),
      levels,
      categories: [category, atp_category, wta_category, men_category, women_category],
      dates: [
        [start_date, end_date],
        [atp_start_date, atp_end_date],
        [wta_start_date, wta_end_date],
        [men_start_date, men_end_date],
        [women_start_date, women_end_date]
      ],
      draws: [[], [atp_draw_s, atp_draw_d], [wta_draw_s, wta_draw_d], [men_draw_s, men_draw_d], [women_draw_s, women_draw_d]],
      tournament: {
        ...tournament,
        id: tournament.id?.toInt()
      },
      year: year.toInt(),
      ...rest
    }
  })

  return {
    count: records[0]?.get("count").toInt() || 0,
    events
  }
})
