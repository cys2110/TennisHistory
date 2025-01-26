export default defineEventHandler(async (query) => {
  const { eid, mid } = getQuery<{ eid: string; mid: string }>(query);

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
            WHEN c1 IS NOT NULL AND t.start_date <= e.start_date AND t.end_date > e.start_date THEN c1.id
            ELSE c.id
          END,
          seed: toString(f.seed),
          status: f.status,
          rank: toString(f.rank),
          s1: toString(s1.s1),
          s2: toString(s1.s2),
          s3: toString(s1.s3),
          s4: toString(s1.s4),
          s5: toString(s1.s5),
          t1: toString(s1.t1),
          t2: toString(s1.t2),
          t3: toString(s1.t3),
          t4: toString(s1.t4),
          t5: toString(s1.t5),
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
            WHEN c1 IS NOT NULL AND t.start_date <= e.start_date AND t.end_date > e.start_date THEN c1.id
            ELSE c.id
          END,
          seed: toString(f.seed),
          status: f.status,
          rank: toString(f.rank),
          s1: toString(s2.s1),
          s2: toString(s2.s2),
          s3: toString(s2.s3),
          s4: toString(s2.s4),
          s5: toString(s2.s5),
          t1: toString(s2.t1),
          t2: toString(s2.t2),
          t3: toString(s2.t3),
          t4: toString(s2.t4),
          t5: toString(s2.t5),
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
        duration: CASE WHEN m.duration_mins IS NOT NULL THEN apoc.temporal.format(m.duration_mins, 'hh:mm') ELSE NULL END,
        winner: w.id,
        round: r.round,
        p1: p1,
        p2: p2,
        service_speed: CASE WHEN s1.max_speed_kph IS NOT NULL THEN [
          {name: 'Max Speed', values: [s1.max_speed_kph, s2.max_speed_kph]},
          {name: '1st serve average speed', values: [s1.avg_sv1_kph, s2.avg_sv1_kph]},
          {name: '2nd serve average speed', values: [s1.avg_sv2_kph, s2.avg_sv2_kph]}
        ] ELSE NULL END,
        return: [
          {name: '1st serve return points won', values: [s1.ret1_w, s1.ret1, s2.ret1_w, s2.ret1]},
          {name: '2nd serve return points won', values: [s1.ret2_w, s1.ret2, s2.ret2_w, s2.ret2]},
          {name: 'Break points converted', values: [s1.bps_converted, s1.bp_opps, s2.bps_converted, s2.bp_opps]}
        ],
        points: [
          {name: 'Service points won', values: [s1.serve1_pts_w + s1.serve2_pts_w, s1.serve1_pts + s1.serve2_pts, s2.serve1_pts_w + s2.serve2_pts_w, s2.serve1_pts + s2.serve2_pts]},
          {name: 'Return points won', values: [s1.ret1_w + s1.ret2_w, s1.ret1 + s1.ret2, s2.ret1_w + s2.ret2_w, s2.ret1 + s2.ret2]},
          {name: 'Total Points Won', values: [s1.serve1_pts_w + s1.serve2_pts_w + s1.ret1_w + s1.ret2_w, s1.serve1_pts + s1.serve2_pts + s1.ret1 + s1.ret2, s2.serve1_pts_w + s2.serve2_pts_w + s2.ret1_w + s2.ret2_w, s2.serve1_pts + s2.serve2_pts + s2.ret1 + s2.ret2]},
          {name: 'Winners', values: CASE WHEN s1.winners IS NOT NULL THEN [s1.winners, s2.winners] ELSE [] END},
          {name: 'Unforced errors', values: CASE WHEN s1.ues IS NOT NULL THEN [s1.ues, s2.ues] ELSE [] END},
          {name: 'Net points won', values: CASE WHEN s1.net IS NOT NULL THEN [s1.net_w, s1.net, s2.net_w, s2.net] ELSE [] END}
          ],
          service_stats: [
          {name: 'Aces', values: [s1.aces, s2.aces]},
          {name: 'Double faults', values: [s1.dfs, s2.dfs]},
          {name: 'First serve', values: [s1.serve1_pts, s1.serve1_pts + s1.serve2_pts, s2.serve1_pts, s2.serve1_pts + s2.serve2_pts]},
          {name: '1st serve points won', values: [s1.serve1_pts_w, s1.serve1_pts, s2.serve1_pts_w, s2.serve1_pts]},
          {name: '2nd serve points won', values: [s1.serve2_pts_w, s1.serve2_pts, s2.serve2_pts_w, s2.serve2_pts]},
          {name: 'Break points saved', values: [s1.bps_saved, s1.bps_faced, s2.bps_saved, s2.bps_faced]}
          ]
      } AS match
    `, { eid: parseInt(eid), mid: parseInt(mid) }
  );

  const match = records.map((record) => record.toObject());

  return match[0].match;
});
