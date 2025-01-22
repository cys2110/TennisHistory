export default defineEventHandler(async (query) => {
  const { eid, mid } = getQuery<{ eid: string; mid: string }>(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (m:Match {match_no: $mid})-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event {id: $eid})-[:ON_SURFACE]->(s:Surface)
      MATCH (c1:Country)<-[:REPRESENTS]-(p1:Player)-[:ENTERED]->(f1:Entry)-[:SCORED]->(s1:P1)-[:SCORED]->(m)<-[:SCORED]-(s2:P2)<-[:SCORED]-(f2:Entry)<-[:ENTERED]-(p2:Player)-[:REPRESENTS]->(c2:Country)
      MATCH (w:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(m)
      MATCH (e)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (m)<-[:UMPIRED]-(u:Umpire)
      RETURN {
        name: t.name,
        surface: s.id,
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
        END,
        date: CASE WHEN m.date IS NOT NULL THEN apoc.temporal.format(m.date, 'dd MMMM yyyy') ELSE NULL END,
        court: m.court,
        umpire: u.id,
        duration: CASE WHEN m.duration IS NOT NULL THEN apoc.temporal.format(m.duration, 'hh:mm') ELSE NULL END,
        winner: w.id,
        round: r.round,
        p1: {
          id: p1.id,
          name: p1.first_name || ' ' || p1.last_name,
          country: c1.id,
          seed: toString(f1.seed),
          status: f1.status,
          rank: toString(f1.rank),
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
        },
        p2: {
          id: p2.id,
          name: p2.first_name || ' ' || p2.last_name,
          country: c2.id,
          seed: toString(f2.seed),
          status: f2.status,
          rank: toString(f2.rank),
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
        },
        service_speed: CASE WHEN s1.max_speed_kph IS NOT NULL THEN [
          {name: 'Max Speed', p1: s1.max_speed_kph, p2: s2.max_speed_kph},
          {name: '1st serve average speed', p1: s1.avg_sv1_kph, p2: s2.avg_sv1_kph},
          {name: '2nd serve average speed', p1: s1.avg_sv2_kph, p2: s2.avg_sv2_kph}
        ] ELSE NULL END,
        return: [
          {name: '1st serve return points won', p1: toString(s1.ret1_w) || '/' || toString(s1.ret1), p1_pc: toInteger(round((s1.ret1_w / toFloat(s1.ret1)) * 100, 0)), p2: toString(s2.ret1_w) || '/' || toString(s2.ret1), p2_pc: toInteger(round((s2.ret1_w / toFloat(s2.ret1)) * 100, 0))},
          {name: '2nd serve return points won', p1: toString(s1.ret2_w) || '/' || toString(s1.ret2), p1_pc: toInteger(round((s1.ret2_w / toFloat(s1.ret2)) * 100, 0)), p2: toString(s2.ret2_w) || '/' || toString(s2.ret2), p2_pc: toInteger(round((s2.ret2_w / toFloat(s2.ret2)) * 100, 0))},
          {name: 'Break points converted', p1: toString(s1.bps_converted) || '/' || toString(s1.bp_opps), p1_pc: toInteger(round((s1.bps_converted / toFloat(s1.bp_opps)) * 100, 0)), p2: toString(s2.bps_converted) || '/' || toString(s2.bp_opps), p2_pc: toInteger(round((s2.bps_converted / toFloat(s2.bp_opps)) * 100, 0))}
          ],
        points: [
          {name: 'Service points won', p1: toString(s1.serve1_pts_w + s1.serve2_pts_w) || '/' || toString(s1.serve1_pts + s1.serve2_pts), p1_pc: toInteger(round(((s1.serve1_pts_w + s1.serve2_pts_w) / (toFloat(s1.serve1_pts) + toFloat(s1.serve2_pts))) * 100, 0)), p2: toString(s2.serve1_pts_w + s2.serve2_pts_w) || '/' || toString(s2.serve1_pts + s2.serve2_pts), p2_pc: toInteger(round(((s2.serve1_pts_w + s2.serve2_pts_w) / (toFloat(s1.serve2_pts) + toFloat(s2.serve2_pts))) * 100, 0))},
          {name: 'Return points won', p1: toString(s1.ret1_w + s1.ret2_w) || '/' || toString(s1.ret1 + s1.ret2), p1_pc: toInteger(round(((s1.ret1_w + s1.ret2_w) / (toFloat(s1.ret1) + toFloat(s1.ret2))) * 100, 0)), p2: toString(s2.ret1_w + s2.ret2_w) || '/' || toString(s2.ret1 + s2.ret2), p2_pc: toInteger(round(((s2.ret1_w + s2.ret2_w) / (toFloat(s2.ret1) + toFloat(s2.ret2))) * 100, 0))},
          {name: 'Total Points Won', p1: toString(s1.serve1_pts_w + s1.serve2_pts_w + s1.ret1_w + s1.ret2_w) || '/' || toString(s1.serve1_pts + s1.serve2_pts + s1.ret1 + s1.ret2), p1_pc: toInteger(round(((s1.serve1_pts_w + s1.serve2_pts_w + s1.ret1_w + s1.ret2_w) / (toFloat(s1.serve1_pts) + toFloat(s1.serve2_pts) + toFloat(s1.ret1) + toFloat(s1.ret2))) * 100, 0)), p2: toString(s2.serve1_pts_w + s2.serve2_pts_w + s2.ret1_w + s2.ret2_w) || '/' || toString(s2.serve1_pts + s2.serve2_pts + s2.ret1 + s2.ret2), p2_pc: toInteger(round(((s2.serve1_pts_w + s2.serve2_pts_w + s2.ret1_w + s2.ret2_w) / (toFloat(s2.serve1_pts) + toFloat(s2.serve2_pts) + toFloat(s2.ret2) + toFloat(s2.ret2))) * 100, 0))}
        ],
        points_extra: CASE WHEN s1.winners IS NOT NULL THEN [
          {name: 'Winners', p1: toString(s1.winners), p2: toString(s2.winners)},
          {name: 'Unforced errors', p1: toString(s1.ues), p2: toString(s2.ues)},
          {name: 'Net points won', p1: toString(s1.net_w) || '/' || toString(s1.net), p1_pc: toInteger(round((s1.net_w / toFloat(s1.net)) * 100, 0)), p2: toString(s2.net_w) || '/' || toString(s2.net), p2_pc: toInteger(round((s2.net_w / toFloat(s2.net)) * 100, 0))}
        ] ELSE [] END,
        service_stats: [
          {name: 'Aces', p1: toString(s1.aces), p2: toString(s2.aces)},
          {name: 'Double faults', p1: toString(s1.dfs), p2: toString(s2.dfs)},
          {name: 'First serve', p1: toString(s1.serve1_pts) || '/' || toString(s1.serve1_pts + s1.serve2_pts), p1_pc: toInteger(round((s1.serve1_pts / (toFloat(s1.serve1_pts) + toFloat(s1.serve2_pts))) * 100, 0)), p2: toString(s2.serve1_pts) || '/' || toString(s2.serve1_pts + s2.serve2_pts), p2_pc: toInteger(round((s2.serve1_pts / (toFloat(s2.serve1_pts) + toFloat(s2.serve2_pts))) * 100, 0))},
          {name: '1st serve points won', p1: toString(s1.serve1_pts_w) || '/' || toString(s1.serve1_pts), p1_pc: toInteger(round((s1.serve1_pts_w / toFloat(s1.serve1_pts)) * 100, 0)), p2: toString(s2.serve1_pts_w) || '/' || toString(s2.serve1_pts), p2_pc: toInteger(round((s2.serve1_pts_w / toFloat(s2.serve1_pts)) * 100, 0))},
          {name: '2nd serve points won', p1: toString(s1.serve2_pts_w) || '/' || toString(s1.serve2_pts), p1_pc: toInteger(round((s1.serve2_pts_w / toFloat(s1.serve2_pts)) * 100, 0)), p2: toString(s2.serve2_pts_w) || '/' || toString(s2.serve2_pts), p2_pc: toInteger(round((s2.serve2_pts_w / toFloat(s2.serve2_pts)) * 100, 0))},
          {name: 'Break points saved', p1: toString(s1.bps_saved) || '/' || toString(s1.bps_faced), p1_pc: toInteger(round((s1.bps_saved / toFloat(s1.bps_faced)) * 100, 0)), p2: toString(s2.bps_saved) || '/' || toString(s2.bps_faced), p2_pc: toInteger(round((s2.bps_saved / toFloat(s2.bps_faced)) * 100, 0))}
        ]
      } AS match
    `, { eid: parseInt(eid), mid: parseInt(mid) }
  );

  const match = records.map((record) => record.toObject());

  return match[0].match;
});
