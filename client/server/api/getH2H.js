export default defineEventHandler(async (query) => {
  const { p1Id, p2Id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (c1:Country)<-[:REPRESENTS]-(p1:Player {id: $p1Id})
        MATCH (p2:Player {id: $p2Id})-[:REPRESENTS]->(c2:Country)
        OPTIONAL MATCH (p1)-[:TURNED_PRO]->(y1:Year)
        OPTIONAL MATCH (p2)-[:TURNED_PRO]->(y2:Year)
        OPTIONAL MATCH (p1)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t1:Match)-[:PLAYED]->(:Round {round: 'Final'})
        OPTIONAL MATCH (p2)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t2:Match)-[:PLAYED]->(:Round {round: 'Final'})
        OPTIONAL MATCH (p1)-[:ENTERED]->(f1:Entry)-[:SCORED]->(s1:Score)-[:SCORED]->(m)<-[:SCORED]-(s2:Score)<-[:SCORED]-(f2:Entry)<-[:ENTERED]-(p2)
        OPTIONAL MATCH (w:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(m)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
        OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:TOOK_PLACE_IN]->(y:Year)
        WITH p1, p2, COUNT(DISTINCT t1) AS p1_titles, COUNT(DISTINCT t2) AS p2_titles, y1, y2, t, e, m, w, r, s, y, s1, s2, c1, c2
        ORDER BY e.start_date
        WITH p1, p2, p1_titles, p2_titles, y1, y2, c1, c2, {
        tname: t.name,
        tid: toString(t.id),
        eid: toString(e.id),
        mid: toString(m.match_no),
        winner: w.id,
        round: r.round,
        surface: s.id,
        year: toString(y.id),
        s1: trim(coalesce(toString(s1.s1), '') + coalesce(toString(s2.s1), '')),
        s2: trim(coalesce(toString(s1.s2), '') + coalesce(toString(s2.s2), '')),
        s3: trim(coalesce(toString(s1.s3), '') + coalesce(toString(s2.s3), '')),
        s4: trim(coalesce(toString(s1.s4), '') + coalesce(toString(s2.s4), '')),
        s5: trim(coalesce(toString(s1.s5), '') + coalesce(toString(s2.s5), '')),
        t1: CASE
            WHEN s1.t1 IS NOT NULL THEN toString(apoc.coll.min([s1.t1, s2.t1]))
            ELSE NULL
        END,
        t2: CASE
            WHEN s1.t2 IS NOT NULL THEN toString(apoc.coll.min([s1.t2, s2.t2]))
            ELSE NULL
        END,
        t3: CASE
            WHEN s1.t3 IS NOT NULL THEN toString(apoc.coll.min([s1.t3, s2.t3]))
            ELSE NULL
        END,
        t4: CASE
            WHEN s1.t4 IS NOT NULL THEN toString(apoc.coll.min([s1.t4, s2.t4]))
            ELSE NULL
        END,
        t5: CASE
            WHEN s1.t5 IS NOT NULL THEN toString(apoc.coll.min([s1.t5, s2.t5]))
            ELSE NULL
        END,
        incomplete: CASE WHEN s1.incomplete IS NOT NULL THEN s1.incomplete WHEN s2.incomplete IS NOT NULL THEN s2.incomplete ELSE NULL END
        } AS match
        WITH p1, p2, p1_titles, p2_titles, y1, y2, c1, c2, COLLECT(DISTINCT match) as matches
        RETURN {
        p1_name: p1.first_name || ' ' || p1.last_name,
        p1_id: p1.id,
        p1_wl: toString(p1.win) || '/' || toString(p1.loss),
        p1_wl_pc: toInteger(round(p1.win / (toFloat(p1.win) + toFloat(p1.loss)) * 100, 0)),
        p1_titles: p1_titles,
        p1_pm: p1.pm_USD,
        p1_ch: p1.career_high,
        p1_rh: p1.rh,
        p1_bh: p1.bh1,
        p1_dob: apoc.temporal.format(p1.dob, 'dd/MM/yy'),
        p1_height: p1.height_cm,
        p1_pro: toString(y1.id),
        p1_country: c1.id,
        p2_name: p2.first_name || ' ' || p2.last_name,
        p2_id: p2.id,
        p2_wl: toString(p2.win) || '/' || toString(p2.loss),
        p2_wl_pc: toInteger(round(p2.win / (toFloat(p2.win) + toFloat(p2.loss)) * 100, 0)),
        p2_titles: p2_titles,
        p2_pm: p2.pm_USD,
        p2_ch: p2.career_high,
        p2_rh: p2.rh,
        p2_bh: p2.bh1,
        p2_dob: apoc.temporal.format(p2.dob, 'dd/MM/yy'),
        p2_height: p2.height_cm,
        p2_pro: toString(y1.id),
        p2_country: c2.id,
        matches: matches
        } AS h2h
      `,
    { p1Id: p1Id, p2Id: p2Id }
  );

  const results = records.map((record) => record.toObject());

  return results[0].h2h;
});
