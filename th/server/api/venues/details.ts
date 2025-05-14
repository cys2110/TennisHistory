import { CategoryEnum, SurfaceEnum } from "../../../utils/enums"

export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    skip: string
    dateSort: "ASC" | "DESC"
  }

  const { id, skip, dateSort } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event)-[:TOOK_PLACE_IN]->(v:Venue {id: $id})-[:LOCATED_IN]->(c:Country)
      MATCH (e)-[:IN_YEAR]->(y:Year)
      MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament)
      WITH *
      ORDER BY e.start_date ${dateSort}
      WITH
      y,
      e,
      t,
      s,
      COLLECT(
        {
          id: v.id,
          name: v.name,
          city: v.city,
          country: {id: c.id, name: c.name, alpha2: c.alpha2}
        }) AS venues
      WITH COLLECT({
        year: toString(y.id),
        surface: {id: s.id, surface: s.surface},
        id: toString(e.id),
        name: e.sponsor_name,
        category: e.category,
        venues: venues,
        start_date: apoc.temporal.format(e.start_date, 'yyyy-MM-dd'),
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
          END,
        draw_type: e.draw_type,
        tournament: {id: toString(t.id), name: t.name}
      }) AS events
      WITH SIZE(events) AS count, events[toInteger($skip)..toInteger($skip) + 25] AS events
      RETURN toString(count) AS count, events
    `,
    { id, skip }
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    events: results.events.filter(Boolean)
  }
})
