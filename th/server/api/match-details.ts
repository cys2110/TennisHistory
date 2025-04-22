export default defineEventHandler(async query => {
  const { eid, mid } = getQuery<{ eid: string; mid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (m:Match {match_no: $mid})-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event {id: $eid})-[:ON_SURFACE]->(s:Surface)
      MATCH (s1:P1)-[:SCORED]->(m)<-[:SCORED]-(s2:P2)
      MATCH (w:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(m)
      MATCH (e)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (m)<-[:UMPIRED]-(u:Umpire)
      CALL (s1, e) {
        MATCH (p:Player)-[:ENTERED]->(f:Entry)-[:SCORED]->(s1)
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[t:REPRESENTED]->(c1:Country)
        RETURN {
          id: p.id,
          name: p.first_name || ' ' || p.last_name,
          country: CASE
            WHEN c1 IS NOT NULL AND t.start_date <= e.start_date AND t.end_date > e.start_date THEN {id: c1.id, name: c1.name, alpha2: c1.alpha2}
            ELSE {id: c.id, name: c.name, alpha2: c.alpha2}
          END,
          seed: toString(f.seed),
          status: f.status,
          rank: toString(f.rank),
          sets: [toString(s1.s1), toString(s1.s2), toString(s1.s3), toString(s1.s4), toString(s1.s5)],
          tbs: [toString(s1.t1), toString(s1.t2), toString(s1.t3), toString(s1.t4), toString(s1.t5)],
          incomplete: s1.incomplete
        } AS p1
      }
      CALL (s2, e) {
        MATCH (p:Player)-[:ENTERED]->(f:Entry)-[:SCORED]->(s2)
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[t:REPRESENTED]->(c1:Country)
        RETURN {
          id: p.id,
          name: p.first_name || ' ' || p.last_name,
          country: CASE
            WHEN c1 IS NOT NULL AND t.start_date <= e.start_date AND t.end_date > e.start_date THEN {id: c1.id, name: c1.name, alpha2: c1.alpha2}
            ELSE {id: c.id, name: c.name, alpha2: c.alpha2}
          END,
          seed: toString(f.seed),
          status: f.status,
          rank: toString(f.rank),
          sets: [toString(s2.s1), toString(s2.s2), toString(s2.s3), toString(s2.s4), toString(s2.s5)],
          tbs: [toString(s2.t1), toString(s2.t2), toString(s2.t3), toString(s2.t4), toString(s2.t5)],
          incomplete: s2.incomplete
        } AS p2
      }
      RETURN {
        name: t.name,
        surface: s.id,
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
        END,
        date: CASE WHEN m.date IS NOT NULL THEN apoc.temporal.format(m.date, 'EEEE dd MMMM yyyy') ELSE NULL END,
        court: m.court,
        umpire: u.id,
        duration: CASE WHEN m.duration IS NOT NULL THEN apoc.temporal.format(m.duration, 'hh:mm:ss') ELSE NULL END,
        winner: w.id,
        round: r.round,
        p1: p1,
        p2: p2,
        aces: [s1.aces, s2.aces],
        dfs: [s1.dfs, s2.dfs],
        serve1: [s1.serve1_w, s1.serve1, s2.serve1_w, s2.serve1],
        serve2: [s1.serve2_w, s1.serve2, s2.serve2_w, s2.serve2],
        bps_saved: [s1.bps_saved, s1.bps_faced, s2.bps_saved, s2.bps_faced],
        ret1: [s1.ret1_w, s1.ret1, s2.ret1_w, s2.ret1],
        ret2: [s1.ret2_w, s1.ret2, s2.ret2_w, s2.ret2],
        bps_converted: [s1.bps_converted, s1.bp_opps, s2.bps_converted, s2.bp_opps],
        winners: [s1.winners, s2.winners],
        ues: [s1.ues, s2.ues],
        net: [s1.net_w, s1.net, s2.net_w, s2.net],
        max_speed: [s1.max_speed, s2.max_speed],
        avg1_speed: [s1.avg1_speed, s2.avg1_speed],
        avg2_speed: [s1.avg1_speed, s2.avg2_speed]
      } AS match
    `,
    { eid: Number(eid), mid: Number(mid) }
  )

  const match = records[0].get("match")

  for (const [key, value] of Object.entries(match)) {
    if (Array.isArray(value)) {
      if (value.some(item => item === null)) {
        delete match[key]
      } else {
        match[key] = value.map(item => item.low)
      }
    }
  }

  return match
})
