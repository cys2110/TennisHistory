export default defineEventHandler(async (event) => {
  const { eid } = getQuery(event);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (:Event {id: $id})<-[:ROUND_OF]-(r:Round)<-[:PLAYED]-(m:Match)<-[:SCORED]-(ws:Winner)<-[:SCORED]-(wf:Entry)<-[:ENTERED]-(wp:Player)-[:REPRESENTS]->(wc:Country)
        OPTIONAL MATCH (m)<-[:SCORED]-(ls:Loser)<-[:SCORED]-(lf:Entry)<-[:ENTERED]-(lp:Player)-[:REPRESENTS]->(lc:Country)
        OPTIONAL MATCH (u:Umpire)-[:UMPIRED]->(m)
        WITH DISTINCT(m), r, ws, wf, wp, wc, ls, lf, lp, lc, u
        WHERE r.number > 0
        WITH m, r, ws, wf, wp, wc, ls, lf, lp, lc, u, apoc.coll.min([wf.rank, lf.rank]) AS minRank
        ORDER BY r.number DESC, minRank
        WITH r, COLLECT({
        mid: m.match_no,
        date: m.date,
        court: m.court,
        duration: m.duration_mins,
        incomplete: m.incomplete,
        umpire: u.id,
        winner_id: wp.id,
        winner_name: wp.first_name + ' ' + wp.last_name,
        winner_country: wc.id,
        winner_seed: wf.seed,
        winner_status: wf.status,
        loser_id: lp.id,
        loser_name: lp.first_name + ' ' + lp.last_name,
        loser_country: lc.id,
        loser_seed: lf.seed,
        loser_status: lf.status,
        loser_incomplete: ls.incomplete,
        ws1: toString(ws.s1),
        ls1: toString(ls.s1),
        ws2: toString(ws.s2),
        ls2: toString(ls.s2),
        ws3: toString(ws.s3),
        ls3: toString(ls.s3),
        ws4: toString(ws.s4),
        ls4: toString(ls.s4),
        ws5: toString(ws.s5),
        ls5: toString(ls.s5),
        wt1: toString(ws.t1),
        lt1: toString(ls.t1),
        wt2: toString(ws.t2),
        lt2: toString(ls.t2),
        wt3: toString(ws.t3),
        lt3: toString(ls.t3),
        wt4: toString(ws.t4),
        lt4: toString(ls.t4),
        wt5: toString(ws.t5),
        lt5: toString(ls.t5)
        }) as matches
        RETURN COLLECT({round: r.round, matches: matches}) AS rounds
      `,
    { id: parseInt(eid) }
  );

  const tournament = records.map((record) => record.toObject());

  return tournament[0].rounds;
});
