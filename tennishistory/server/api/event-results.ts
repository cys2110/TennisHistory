export default defineEventHandler(async query => {
  const { eid } = getQuery<{ eid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})<-[:ROUND_OF]-(r:Round) WHERE r.number > 0
      WITH r, e
        ORDER BY r.number DESC
      CALL (r, e) {
        MATCH (r)<-[:PLAYED]-(m:Match)<-[:SCORED]-(ws:Winner)<-[:SCORED]-(wf:Entry)<-[:ENTERED]-(wp:Player)
        OPTIONAL MATCH (m)<-[:SCORED]-(ls:Loser)<-[:SCORED]-(lf:Entry)<-[:ENTERED]-(lp:Player)
        OPTIONAL MATCH (u:Umpire)-[:UMPIRED]->(m)
        CALL (e, wp) {
          MATCH (wp)-[:REPRESENTS]->(c:Country)
          OPTIONAL MATCH (wp)-[t:REPRESENTED]->(n:Country)
          RETURN CASE
            WHEN t IS NOT NULL AND t.start_date <= e.start_date AND t.end_date > e.start_date THEN {id: n.id, alpha2: n.alpha2, name: n.name}
            ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
          END AS winner_country
        }
        CALL (e, lp) {
          MATCH (lp)-[:REPRESENTS]->(c:Country)
          OPTIONAL MATCH (lp)-[t:REPRESENTED]->(n:Country)
          RETURN CASE
            WHEN t IS NOT NULL AND t.start_date <= e.start_date AND t.end_date > e.start_date THEN {id: n.id, alpha2: n.alpha2, name: n.name}
            ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
          END AS loser_country
        }
        WITH m, ws, wf, wp, ls, lf, lp, u, winner_country, loser_country, apoc.coll.min([wf.rank, lf.rank]) AS minRank
          ORDER BY minRank
        RETURN COLLECT({
          mid: toString(m.match_no),
          date: CASE WHEN m.date IS NOT NULL THEN apoc.temporal.format(m.date, 'EEEE dd MMMM yyyy') ELSE NULL END,
          court: m.court,
          duration: CASE WHEN m.duration IS NOT NULL THEN apoc.temporal.format(m.duration, 'hh:mm') ELSE NULL END,
          incomplete: m.incomplete,
          umpire: u.id,
          winner: {
            id: wp.id,
            name: wp.first_name || ' ' || wp.last_name,
            country: winner_country,
            seed: toString(wf.seed),
            status: wf.status,
            sets: [toString(ws.s1), toString(ws.s2), toString(ws.s3), toString(ws.s4), toString(ws.s5)],
            tbs: [toString(ws.t1), toString(ws.t2), toString(ws.t3), toString(ws.t4), toString(ws.t5)]
          },
          loser: {
            id: lp.id,
            name: lp.first_name || ' ' || lp.last_name,
            country: loser_country,
            seed: toString(lf.seed),
            status: lf.status,
            incomplete: ls.incomplete,
            sets: [toString(ls.s1), toString(ls.s2), toString(ls.s3), toString(ls.s4), toString(ls.s5)],
            tbs: [toString(ls.t1), toString(ls.t2), toString(ls.t3), toString(ls.t4), toString(ls.t5)]
          }
        }) AS matches
      }
      RETURN COLLECT({title: r.round, matches: matches}) AS rounds
    `,
    { id: Number(eid) }
  )

  const tournament = records[0].toObject()

  return tournament.rounds
})
