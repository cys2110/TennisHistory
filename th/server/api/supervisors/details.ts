export default defineEventHandler(async query => {
  const { year, id } = getQuery<{ year: string; id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH
      (x:Supervisor)-[:SUPERVISED]->
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
        [:IN_YEAR]->
      (y:Year {id: 2025})
    WHERE apoc.text.compareCleaned(x.id, $id)
    MATCH (e:Event)-[:EDITION_OF]->(t:Tournament)
    OPTIONAL MATCH (e)-[:ON_SURFACE]->(s:Surface)
    OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
    WITH DISTINCT
      *,
      apoc.coll.min([
        e.start_date,
        e.atp_start_date,
        e.wta_start_date,
        e.men_start_date,
        e.women_start_date
      ]) AS start_date
    ORDER BY start_date
    WITH
      CASE
        WHEN COUNT(v) = 0 THEN []
        ELSE COLLECT(apoc.map.merge(properties(v), {country: properties(c)}))
      END AS venues,
      properties(s) AS surface,
      properties(t) AS tournament,
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
    RETURN
      apoc.map.clean(
          apoc.map.merge(
            event,
            {
              surface: surface,
              venues: venues,
              tournament: tournament,
              year: year,
              tours: tours
            }
          ),
          [],
          [null]
        ) AS event
    `,
    { year: Number(year), id }
  )

  // Convert Neo4j types to standard JavaScript types
  const events = records.map(record => {
    const event = record.get("event")
    const dateKeys = [
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
          year: event[key].year.toInt(),
          month: event[key].month.toInt(),
          day: event[key].day.toInt()
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
      ...rest
    }
  })

  return events
})
