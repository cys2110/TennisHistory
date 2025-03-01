export default defineEventHandler(async (event) => {
	const { eid } = getQuery<{ eid: string }>(event);

	const { records } = await useDriver().executeQuery(
		`/* cypher */
      MATCH (e:Event {id: $id})<-[:ROUND_OF]-(r:Round)<-[:PLAYED]-(m:Match)
      WITH m, r, e
      ORDER BY m.match_no
      OPTIONAL MATCH (m)<-[:SCORED]-(p1s:P1)<-[:SCORED]-(p1f:Entry)<-[:ENTERED]-(p1:Player)
      OPTIONAL MATCH (m)<-[:SCORED]-(p2s:P2)<-[:SCORED]-(p2f:Entry)<-[:ENTERED]-(p2:Player)
      OPTIONAL MATCH (m)<-[:SCORED]-(:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
      CALL (e, p1) {
        MATCH (p1)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p1)-[t:REPRESENTED]->(c1:Country)
        RETURN CASE
          WHEN t IS NOT NULL AND t.start_date <= e.start_date AND t.end_date > e.start_date THEN {id: c1.id, alpha2: c1.alpha2, name: c1.name}
          ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
        END AS p1c
      }
      CALL (e, p2) {
        MATCH (p2)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p2)-[t:REPRESENTED]->(c1:Country)
        RETURN CASE
          WHEN t IS NOT NULL AND t.start_date <= e.start_date AND t.end_date > e.start_date THEN {id: c1.id, alpha2: c1.alpha2, name: c1.name}
          ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
        END AS p2c
      }
      WITH {
        round: r.round,
        mid: toString(m.match_no),
        incomplete: m.incomplete,
        winner_id: w.id,
        p1: {
          id: p1.id,
          name: p1.first_name || ' ' || p1.last_name,
          country: p1c,
          seed: toString(p1f.seed),
          status: p1f.status,
          incomplete: p1s.incomplete,
          sets: [toString(p1s.s1), toString(p1s.s2), toString(p1s.s3), toString(p1s.s4), toString(p1s.s5)],
          tbs: [toString(p1s.t1), toString(p1s.t2), toString(p1s.t3), toString(p1s.t4), toString(p1s.t5)]
        },
        p2: {
          id: p2.id,
          name: p2.first_name + ' ' + p2.last_name,
          country: p2c,
          seed: toString(p2f.seed),
          status: p2f.status,
          incomplete: p2s.incomplete,
          sets: [toString(p2s.s1), toString(p2s.s2), toString(p2s.s3), toString(p2s.s4), toString(p2s.s5)],
          tbs: [toString(p2s.t1), toString(p2s.t2), toString(p2s.t3), toString(p2s.t4), toString(p2s.t5)]
        }
      } AS match
      RETURN COLLECT(match) AS matches
    `, { id: parseInt(eid) }
	);

	const tournament = records.map((record) => record.toObject());

	return tournament[0].matches;
});
