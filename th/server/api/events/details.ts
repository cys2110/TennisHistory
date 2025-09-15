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
    if (event[key]) event[key] = event[key]?.toInt()
  }

  const {
    category,
    atp_category,
    wta_category,
    men_category,
    women_category,
    id: eid,
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
    atp_draw_s,
    atp_draw_d,
    wta_draw_s,
    wta_draw_d,
    men_draw_s,
    men_draw_d,
    women_draw_s,
    women_draw_d,
    draw_type,
    pm,
    atp_pm,
    wta_pm,
    men_pm,
    women_pm,
    tfc,
    atp_tfc,
    wta_tfc,
    men_tfc,
    women_tfc,
    currency,
    atp_currency,
    wta_currency,
    men_currency,
    women_currency,
    ...rest
  } = event

  return {
    id: eid,
    categories: [category, atp_category, wta_category, men_category, women_category],
    dates: [
      [start_date, end_date],
      [atp_start_date, atp_end_date],
      [wta_start_date, wta_end_date],
      [men_start_date, men_end_date],
      [women_start_date, women_end_date]
    ],
    draws: [
      [draw_type, undefined],
      [atp_draw_s, atp_draw_d],
      [wta_draw_s, wta_draw_d],
      [men_draw_s, men_draw_d],
      [women_draw_s, women_draw_d]
    ],
    currencies: [currency, atp_currency, wta_currency, men_currency, women_currency],
    pm: [pm, atp_pm, wta_pm, men_pm, women_pm],
    tfc: [tfc, atp_tfc, wta_tfc, men_tfc, women_tfc],
    ...rest
  }
})
