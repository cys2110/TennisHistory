export default defineEventHandler(async (query) => {
    const { pid } = getQuery(query);

    const { records } = await useDriver().executeQuery(
        `
      MATCH (p:Player {id: $id})
      CALL(p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
        OPTIONAL MATCH (y:Year)<-[:TOOK_PLACE_IN]-(e)-[:ON_SURFACE]->(s:Surface)
        WITH DISTINCT e, t, y, s
        ORDER BY e.start_date
        WITH CASE
          WHEN e IS NOT NULL THEN {
            eid: toString(e.id),
            tid: toString(t.id),
            tname: t.name,
            surface: s.id,
            date: apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          }
          ELSE NULL
        END AS event, y
        WITH COLLECT(event) AS events, y
        RETURN COLLECT({
            year: toString(y.id),
            events: events
        }) AS titles
      }
      CALL(p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
        OPTIONAL MATCH (y:Year)<-[:TOOK_PLACE_IN]-(e)-[:ON_SURFACE]->(s:Surface)
        WITH DISTINCT e, t, y, s
        ORDER BY e.start_date
        WITH CASE
          WHEN e IS NOT NULL THEN {
            eid: toString(e.id),
            tid: toString(t.id),
            tname: t.name,
            surface: s.id,
            date: apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          }
          ELSE NULL
        END AS event, y
        WITH COLLECT(event) AS events, y
        RETURN COLLECT({
            year: toString(y.id),
            events: events
        }) AS finals
      }
      RETURN {titles: titles, finals: finals} AS result
    `,
        { id: pid }
    );

    const player = records.map((record) => record.toObject());

    return player[0].result;
});
