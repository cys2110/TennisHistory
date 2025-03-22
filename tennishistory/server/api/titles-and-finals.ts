export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      CALL(p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
        OPTIONAL MATCH (y:Year)<-[:IN_YEAR]-(e)-[:ON_SURFACE]->(s:Surface)
        WITH DISTINCT e, t, y, s
        ORDER BY e.start_date
        WITH CASE
          WHEN e IS NOT NULL THEN {
            eid: toString(e.id),
            tid: toString(t.id),
            name: t.name,
            surface: s.id,
            dates: apoc.temporal.format(e.end_date, 'dd MMMM yyyy'),
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
        WITH DISTINCT e, t, y, s
        ORDER BY e.start_date
        WITH CASE
          WHEN e IS NOT NULL THEN {
            eid: toString(e.id),
            tid: toString(t.id),
            name: t.name,
            surface: s.id,
            dates: apoc.temporal.format(e.end_date, 'dd MMMM yyyy'),
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
