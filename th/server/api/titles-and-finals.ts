export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      CALL(p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
        OPTIONAL MATCH (y:Year)<-[:IN_YEAR]-(e)-[:ON_SURFACE]->(s:Surface)
        OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        WITH DISTINCT e, t, y, s, v, c
        ORDER BY e.start_date
        WITH y, e, t, s, COLLECT({id: v.id,name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues
        WITH CASE
          WHEN e IS NOT NULL THEN {
            year: toString(y.id),
            eid: toString(e.id),
            tid: toString(t.id),
            name: t.name,
            ename: e.sponsor_name,
            category: e.category,
            surface: s.surface,
            venues: venues,
            dates: CASE
              WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
              WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
              ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            END,
            draw_type: e.draw_type
          }
          ELSE NULL
        END AS event, y
        WITH COLLECT(DISTINCT event) AS events, y
        RETURN COLLECT({
            title: toString(y.id),
            events: events
        }) AS titles
      }
      CALL(p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
        OPTIONAL MATCH (y:Year)<-[:IN_YEAR]-(e)-[:ON_SURFACE]->(s:Surface)
        OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        WITH DISTINCT e, t, y, s, v, c
        ORDER BY e.start_date
        WITH y, e, t, s, COLLECT({id: v.id,name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues
        WITH CASE
          WHEN e IS NOT NULL THEN {
            year: toString(y.id),
            eid: toString(e.id),
            tid: toString(t.id),
            name: t.name,
            ename: e.sponsor_name,
            category: e.category,
            surface: s.surface,
            venues: venues,
            dates: CASE
              WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
              WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
              ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            END,
            draw_type: e.draw_type
          }
          ELSE NULL
        END AS event, y
        WITH COLLECT(DISTINCT event) AS events, y
        RETURN COLLECT({
            title: toString(y.id),
            events: events
        }) AS finals
      }
      RETURN {titles: titles, finals: finals} AS result
    `,
    { id }
  )

  const results = records[0].toObject()
  const player = {
    titles: results.result.titles.filter((title: any) => title.title !== null),
    finals: results.result.finals.filter((title: any) => title.title !== null)
  }

  return player
})
