export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (e:Event {id: $id})-[:EDITION_OF]->(t:Tournament)
    OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)
    OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
    OPTIONAL MATCH (sup:Supervisor)-[:SUPERVISED]->(e)
    WITH DISTINCT
      apoc.any.properties(e) AS eventProperties,
      apoc.any.properties(t) AS tournament,
      COLLECT(
        DISTINCT
        CASE
          WHEN v IS NULL THEN null
          ELSE
            apoc.map.merge(
              apoc.any.properties(v),
              {country: apoc.any.properties(c)}
            )
        END
      ) AS venues,
      COLLECT(sup.id) AS supervisors,
      apoc.any.properties(s) AS surface
    RETURN
      apoc.map.merge(
        eventProperties,
        {
          tournament: tournament,
          venues: venues,
          supervisors: supervisors,
          surface: surface
        }
      ) AS event
    `,
    { id: Number(id) }
  )

  const event = records[0].get("event")
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
  const numberKeys = ["id", "tfc", "pm", "atp_tfc", "atp_pm", "wta_tfc", "wta_pm", "men_pm", "men_tfc", "women_pm", "women_tfc"]

  for (const key of dateKeys) {
    if (event[key]) {
      event[key] = {
        year: event[key].year.low,
        month: event[key].month.low,
        day: event[key].day.low
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
