export default defineEventHandler(async query => {
  interface QueryProps {
    year: string
    upcoming: string
  }

  const { year, upcoming } = getQuery<QueryProps>(query)

  const params = {
    year: Number(year),
    upcoming: upcoming === "false" ? false : true
  }

  // TODO: Remove start date guards
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (y:Year {id: $year})<-[:IN_YEAR]-(e:Event)-[:EDITION_OF]->(t:Tournament)
    OPTIONAL MATCH (e)-[:ON_SURFACE]->(s:Surface)
    OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
    WITH DISTINCT
      *,
      apoc.coll.min(
        [
          e.start_date,
          e.atp_start_date,
          e.wta_start_date,
          e.men_start_date,
          e.women_start_date
        ]
      ) AS start_date
    WHERE
      coalesce(
        e.start_date,
        e.atp_start_date,
        e.wta_start_date,
        e.men_start_date,
        e.women_start_date
      ) IS
      NOT
      NULL
    ORDER BY start_date
    WITH
      CASE
        WHEN COUNT(v) = 0 THEN []
        ELSE COLLECT(apoc.map.merge(properties(v), {country: properties(c)}))
      END AS venues,
      properties(s) AS surface,
      properties(t) AS tournament,
      properties(e) AS event,
      [x IN labels(e) WHERE NOT x IN ['Event', 'Update']] AS tours,
      y.id AS year
    RETURN
      apoc.map.merge(
        event,
        {
          surface: surface,
          venues: venues,
          tournament: tournament,
          year: year,
          tours: tours
        }
      ) AS event
    `,
    params
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
    const numberKeys = ["id", "tfc", "pm", "atp_tfc", "atp_pm", "wta_tfc", "wta_pm", "men_pm", "women_pm", "men_tfc", "women_tfc"]

    for (const key of dateKeys) {
      if (event[key]) {
        event[key] = {
          year: event[key].year?.toInt(),
          month: event[key].month?.toInt(),
          day: event[key].day?.toInt()
        }
      }
    }

    for (const key of numberKeys) {
      if (event[key]) event[key] = event[key]?.toInt()
    }

    return {
      ...event,
      tournament: {
        ...event.tournament,
        id: event.tournament.id?.toInt()
      }
    }
  })

  return events
})
