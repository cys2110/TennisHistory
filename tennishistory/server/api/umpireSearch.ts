export default defineEventHandler(async (query) => {
  const { id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Umpire {id: $id})-[:UMPIRED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
      MATCH (e)-[:TOOK_PLACE_IN]->(y:Year)
      MATCH (p1:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:P1)-[:SCORED]->(m)<-[:SCORED]-(:P2)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2:Player)
      WITH m, r, e, t, p1, p2, y
      ORDER BY e.start_date DESC, r.number DESC
      WITH {
      match_no: toString(m.match_no),
      p1: p1.first_name || ' ' || p1.last_name,
      p2: p2.first_name || ' ' || p2.last_name
      } AS match, r, t, e, y
      WITH r, t, e, COLLECT(match) AS matches, y
      WITH t, e, y, {
      round: r.round,
      matches: matches
      } AS round
      WITH t, e, COLLECT(round) AS rounds, y
      WITH {
      tname: t.name,
      tid: toString(t.id),
      eid: toString(e.id),
      year: toString(y.id),
      rounds: rounds
      } as event
      RETURN COLLECT(event) AS events
    `, { id: id }
  );

  const events = records.map((record) => record.toObject());

  return events[0].events;
});
