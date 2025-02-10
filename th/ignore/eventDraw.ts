export default defineEventHandler(async (event) => {
	const { eid } = getQuery<{ eid: string }>(event);

	const { records } = await useDriver().executeQuery(
		`/* cypher */
      MATCH (e:Event {id: $id})<-[:ROUND_OF]-(r:Round)<-[:PLAYED]-(m:Match)
      MATCH (e)-[:EDITION_OF]->(t:Tournament)
      WITH m, r, t.name AS name
      WHERE r.number > 0
      ORDER BY r.number DESC, m.match_no
      CALL(m) {
        OPTIONAL MATCH (m)<-[:SCORED]-(p1s:P1)<-[:SCORED]-(p1f:Entry)<-[:ENTERED]-(p1:Player)-[:REPRESENTS]->(p1c:Country)
        OPTIONAL MATCH (m)<-[:SCORED]-(p2s:P2)<-[:SCORED]-(p2f:Entry)<-[:ENTERED]-(p2:Player)-[:REPRESENTS]->(p2c:Country)
        OPTIONAL MATCH (m)<-[:SCORED]-(:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
        RETURN {
          mid: toString(m.match_no),
          incomplete: m.incomplete,
          winner: w.id,
          p1: {
            id: p1.id,
            name: p1.first_name + ' ' + p1.last_name,
            country: p1c.id,
            seed: toString(p1f.seed),
            status: p1f.status,
            incomplete: p1s.incomplete,
            s1: toString(p1s.s1),
            s2: toString(p1s.s2),
            s3: toString(p1s.s3),
            s4: toString(p1s.s4),
            s5: toString(p1s.s5),
            t1: toString(p1s.t1),
            t2: toString(p1s.t2),
            t3: toString(p1s.t3),
            t4: toString(p1s.t4),
            t5: toString(p1s.t5)
          },
          p2: {
            id: p2.id,
            name: p2.first_name + ' ' + p2.last_name,
            country: p2c.id,
            seed: toString(p2f.seed),
            status: p2f.status,
            incomplete: p2s.incomplete,
            s1: toString(p2s.s1),
            s2: toString(p2s.s2),
            s3: toString(p2s.s3),
            s4: toString(p2s.s4),
            s5: toString(p2s.s5),
            t1: toString(p2s.t1),
            t2: toString(p2s.t2),
            t3: toString(p2s.t3),
            t4: toString(p2s.t4),
            t5: toString(p2s.t5)
          }
        } AS match
      }
      WITH r, COLLECT(match) AS matches, name
      RETURN COLLECT({round: r.round, number: toString(r.number), matches: matches}) AS rounds
    `, { id: parseInt(eid) }
	);

	const tournament = records.map((record) => record.toObject());

	return tournament[0].rounds;
});
