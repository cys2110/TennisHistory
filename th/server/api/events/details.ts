export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (e:Event {id: $id})-[:EDITION_OF]->(t:Tournament)
    OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)
    OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
    OPTIONAL MATCH (sup:Supervisor)-[:SUPERVISED]->(e)
    WITH DISTINCT
      properties(e) AS eventProperties,
      COLLECT(
        DISTINCT
        CASE
          WHEN v IS NULL THEN null
          ELSE apoc.map.merge(properties(v), {country: properties(c)})
        END) AS venues,
      COLLECT(properties(sup)) AS supervisors,
      properties(s) AS surface
    RETURN
      apoc.map.merge(
        eventProperties,
        {venues: venues, supervisors: supervisors, surface: surface}
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
  const numberKeys = ["tfc", "pm", "atp_tfc", "atp_pm", "wta_tfc", "wta_pm", "men_pm", "men_tfc", "women_pm", "women_tfc"]

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

  return event
})
