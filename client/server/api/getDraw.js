export default defineEventHandler(async (event) => {
  const { eid } = getQuery(event);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (:Event {id: $id})<-[:ROUND_OF]-(r:Round)<-[:PLAYED]-(m:Match)
        OPTIONAL MATCH (m)<-[:SCORED]-(p1s:P1)<-[:SCORED]-(p1f:Entry)<-[:ENTERED]-(p1:Player)-[:REPRESENTS]->(p1c:Country)
        OPTIONAL MATCH (m)<-[:SCORED]-(p2s:P2)<-[:SCORED]-(p2f:Entry)<-[:ENTERED]-(p2:Player)-[:REPRESENTS]->(p2c:Country)
        OPTIONAL MATCH (m)<-[:SCORED]-(:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
        WITH DISTINCT(m), r, p1s, p1f, p1, p1c, p2s, p2f, p2, p2c, w
        WHERE r.number > 0
        WITH m, r, p1s, p1f, p1, p1c, p2s, p2f, p2, p2c, w
        ORDER BY r.number DESC, m.match_no
        WITH r, COLLECT({
        mid: toString(m.match_no),
        incomplete: m.incomplete,
        winner: w.id,
        p1_id: p1.id,
        p1_name: p1.first_name + ' ' + p1.last_name,
        p1_country: p1c.id,
        p1_seed: toString(p1f.seed),
        p1_status: p1f.status,
        p1_incomplete: p1s.incomplete,
        p2_id: p2.id,
        p2_name: p2.first_name + ' ' + p2.last_name,
        p2_country: p2c.id,
        p2_seed: toString(p2f.seed),
        p2_status: p2f.status,
        p2_incomplete: p2s.incomplete,
        p1s1: toString(p1s.s1),
        p2s1: toString(p2s.s1),
        p1s2: toString(p1s.s2),
        p2s2: toString(p2s.s2),
        p1s3: toString(p1s.s3),
        p2s3: toString(p2s.s3),
        p1s4: toString(p1s.s4),
        p2s4: toString(p2s.s4),
        p1s5: toString(p1s.s5),
        p2s5: toString(p2s.s5),
        p1t1: toString(p1s.t1),
        p2t1: toString(p2s.t1),
        p1t2: toString(p1s.t2),
        p2t2: toString(p2s.t2),
        p1t3: toString(p1s.t3),
        p2t3: toString(p2s.t3),
        p1t4: toString(p1s.t4),
        p2t4: toString(p2s.t4),
        p1t5: toString(p1s.t5),
        p2t5: toString(p2s.t5)
        }) as matches
        RETURN COLLECT({round: r.round, number: r.number, matches: matches}) AS rounds
        `,
    { id: parseInt(eid) }
  );

  const tournament = records.map((record) => record.toObject());

  return tournament[0].rounds;
});
