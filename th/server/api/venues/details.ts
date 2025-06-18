export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  // TODO: Remove start date guard
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (v:Venue {id: $id})-[:LOCATED_IN]->(c:Country)
      OPTIONAL MATCH (t:Tournament)<-[:EDITION_OF]-(e:Event)-[:TOOK_PLACE_IN]->(v)
      WHERE
        (e.start_date IS NOT NULL OR
          e.atp_start_date IS NOT NULL OR
          e.wta_start_date IS NOT NULL)
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
          e2.wta_start_date IS NOT NULL)
      OPTIONAL MATCH (e2)-[:IN_YEAR]->(y2:Year)
      OPTIONAL MATCH (s2:Surface)<-[:ON_SURFACE]-(tie)
      WITH
        *,
        CASE
          WHEN e2 IS NOT NULL THEN e2.start_date
          ELSE apoc.coll.min([e.start_date, e.atp_start_date, e.wta_start_date])
        END AS start_date
      ORDER BY start_date
      WITH
        y,
        e,
        t,
        s,
        e2,
        y2,
        t2,
        s2,
        v.name AS venue_name,
        v.city AS city,
        start_date,
        COLLECT(
          {
            id: v.id,
            name: v.name,
            city: v.city,
            country: {id: c.id, name: c.name, alpha2: c.alpha2}
          }
        ) AS venues
      RETURN
        CASE
          WHEN
            e IS NOT NULL
            THEN
              {
                tours: labels(e),
                year: y.id,
                surface: {id: s.id, environment: s.environment, surface: s.surface},
                id: e.id,
                name: e.sponsor_name,
                category: e.category,
                atp_category: e.atp_category,
                wta_category: e.wta_category,
                venues: venues,
                start_date: apoc.temporal.format(start_date, 'yyyy-MM-dd'),
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
                wta_dates:
                  CASE
                    WHEN e.wta_start_date IS NULL OR e.wta_end_date IS NULL THEN null
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
                  END,
                tournament: {id: t.id, name: t.name}
              }
          WHEN
            e2 IS NOT NULL
            THEN
              {
                tours: labels(e2),
                year: y2.id,
                surface:
                  {id: s2.id, environment: s2.environment, surface: s2.surface},
                id: e2.id,
                category: e2.category,
                venues: venues,
                start_date: apoc.temporal.format(start_date, 'yyyy-MM-dd'),
                dates:
                  CASE
                    WHEN e2.start_date IS NULL OR e2.end_date IS NULL THEN null
                    WHEN
                      e2.start_date.year <> e2.end_date.year
                      THEN
                        apoc.temporal.format(e2.start_date, 'dd MMMM yyyy') ||
                        ' - ' ||
                        apoc.temporal.format(e2.end_date, 'dd MMMM yyyy')
                    WHEN
                      e2.start_date.month <> e2.end_date.month
                      THEN
                        apoc.temporal.format(e2.start_date, 'dd MMMM') ||
                        ' - ' ||
                        apoc.temporal.format(e2.end_date, 'dd MMMM yyyy')
                    ELSE
                      apoc.temporal.format(e2.start_date, 'dd') ||
                      ' - ' ||
                      apoc.temporal.format(e2.end_date, 'dd MMMM yyyy')
                  END,
                tournament: {id: t2.id, name: t2.name}
              }
          ELSE null
        END AS event,
        venue_name,
        city
    `,
    { id }
  )

  const results = records.map(record => record.get("event"))

  return {
    events: results.filter(Boolean).map(event => ({
      ...event,
      tours: event.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
      id: event.id.low,
      year: event.year.low,
      venues: event.venues.filter(Boolean),
      tournament: {
        ...event.tournament,
        id: event.tournament.id.low
      }
    })),
    name: records[0].get("venue_name"),
    city: records[0].get("city")
  }
})
