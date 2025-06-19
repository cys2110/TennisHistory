export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      OPTIONAL MATCH (sup:Supervisor)-[:SUPERVISED]->(e)
      WITH DISTINCT
        (e),
        t,
        COLLECT(DISTINCT
              CASE
                WHEN
                  v IS NOT NULL
                  THEN
                    {
                      id: v.id,
                      name: v.name,
                      city: v.city,
                      country: {id: c.id, name: c.name, alpha2: c.alpha2}
                    }
                ELSE null
              END
            ) AS venues,
        COLLECT(sup.id) AS supervisors,
        CASE
          WHEN s IS NULL THEN null
          ELSE {id: s.id, surface: s.surface}
        END AS surface
      RETURN
        {
          name: e.sponsor_name,
          category: e.category,
          atp_category: e.atp_category,
          wta_category: e.wta_category,
          surface: surface,
          venues: venues,
          dates:
            CASE
              WHEN e.start_date IS NULL OR e.end_date IS NULL THEN null
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
              WHEN e.atp_start_date IS NULL OR e.atp_end_date IS NULL THEN null
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
          tfc:
            CASE
              WHEN e.tfc IS NULL THEN null
              ELSE apoc.number.format(e.tfc, '#,###')
            END,
          pm:
            CASE
              WHEN e.pm IS NULL THEN null
              ELSE apoc.number.format(e.pm, '#,###')
            END,
          atp_tfc:
            CASE
              WHEN e.atp_tfc IS NULL THEN null
              ELSE apoc.number.format(e.atp_tfc, '#,###')
            END,
          atp_pm:
            CASE
              WHEN e.atp_pm IS NULL THEN null
              ELSE apoc.number.format(e.atp_pm, '#,###')
            END,
          wta_tfc:
            CASE
              WHEN e.wta_tfc IS NULL THEN null
              ELSE apoc.number.format(e.wta_tfc, '#,###')
            END,
          currency: e.currency,
          supervisors: supervisors
        } AS event
    `,
    { id: Number(id) }
  )

  const results = records[0].get("event")

  return results
})
