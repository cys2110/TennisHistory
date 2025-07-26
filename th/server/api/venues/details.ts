export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  // TODO: Remove start date guards
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country) WHERE apoc.text.compareCleaned(v.id, $id)
    OPTIONAL MATCH (t:Tournament)<-[:EDITION_OF]-(e:Event)-[:TOOK_PLACE_IN]->(v)
    WHERE
      (e.start_date IS NOT NULL OR e.atp_start_date IS NOT NULL OR e.wta_start_date IS NOT NULL OR e.men_start_date IS NOT NULL OR e.women_start_date IS NOT NULL)
    OPTIONAL MATCH (e)-[:IN_YEAR]->(y:Year)
    OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)
    OPTIONAL MATCH
        (v)<-[:TOOK_PLACE_IN]-
        (tie:Tie)-[:TIE_OF]->
        (:Round)-[:ROUND_OF]->
        (e2:Event)-[:EDITION_OF]-
        (t2:Tournament)
      WHERE
        (e2.start_date IS NOT NULL OR
          e2.atp_start_date IS NOT NULL OR
          e2.wta_start_date IS NOT NULL OR
          e2.men_start_date IS NOT NULL OR
          e2.women_start_date IS NOT NULL)
      OPTIONAL MATCH (e2)-[:IN_YEAR]->(y2:Year)
      OPTIONAL MATCH (s2:Surface)<-[:ON_SURFACE]-(tie)
    WITH
      DISTINCT *,
      CASE
        WHEN e2 IS NOT NULL THEN e2.start_date
        ELSE apoc.coll.min([e.start_date, e.atp_start_date, e.wta_start_date, e.men_start_date, e.women_start_date])
      END AS start_date
    ORDER BY start_date
    WITH
    CASE
      WHEN COUNT(v) = 0 THEN []
      ELSE
        COLLECT(
          apoc.map.merge(
            apoc.any.properties(v),
            {country: apoc.any.properties(c)}
          )
        )
    END AS venues,
    apoc.any.properties(s) AS surface,
    apoc.any.properties(s2) AS surface2,
    apoc.any.properties(t) AS tournament,
    apoc.any.properties(t2) AS tournament2,
    apoc.any.properties(e) AS event,
    apoc.any.properties(e2) AS event2,
    [x IN labels(e) WHERE NOT x IN ['Event', 'Update']] AS tours,
    [x IN labels(e2) WHERE NOT x IN ['Event', 'Update']] AS tours2,
    y.id AS year,
    y2.id AS year2
    RETURN
      CASE
        WHEN event IS NOT NULL
          THEN
            apoc.map.merge(
              event,
              {
                surface: surface,
                venues: venues,
                tournament: tournament,
                year: year,
                tours: tours
              }
            )
        ELSE
          apoc.map.merge(
            event2,
            {
              surface: surface2,
              venues: venues,
              tournament: tournament2,
              year: year2,
              tours: tours2
            }
          )
      END AS event
    `,
    { id }
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
    const numberKeys = ["id", "tfc", "pm", "atp_tfc", "atp_pm", "wta_tfc", "wta_pm", "men_pm", "women_pm", "men_tfc", "women_tfc", "year"]

    for (const key of dateKeys) {
      if (event[key]) {
        event[key] = {
          year: event[key].year.toInt(),
          month: event[key].month.toInt(),
          day: event[key].day.toInt()
        }
      }
    }

    for (const key of numberKeys) {
      if (event[key]) {
        event[key] = event[key]?.toInt()
      }
    }

    return {
      ...event,
      tournament: {
        ...event.tournament,
        id: event.tournament.id.toInt()
      }
    }
  })

  return events
})
