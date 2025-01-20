export default defineEventHandler(async (query) => {
    const { p1Id, p2Id } = getQuery(query);

    const { records } = await useDriver().executeQuery(
        `/* cypher */
        MATCH (p1:Player {id: $p1Id})
        MATCH (p2:Player {id: $p2Id})
        CALL (p1) {
          MATCH (p1)-[:REPRESENTS]->(c)
          OPTIONAL MATCH (p1)-[:TURNED_PRO]->(y:Year)
          OPTIONAL MATCH (p1)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t:Match)-[:PLAYED]->(:Round {round: 'Final'})
          WITH p1, y, c, COUNT(DISTINCT(t)) as titles
          RETURN {
            name: p1.first_name || ' ' || p1.last_name,
            id: p1.id,
            wl: toString(p1.win) || '/' || toString(p1.loss),
            wl_pc: toInteger(round(p1.win / (toFloat(p1.win) + toFloat(p1.loss)) * 100, 0)),
            pm: p1.pm_USD,
            rh: p1.rh,
            bh: p1.bh1,
            country: c.id,
            pro: toString(y.id),
            titles: toString(titles),
            dob: apoc.temporal.format(p1.dob, 'dd/MM/yy'),
            height: p1.height_cm,
            ch: p1.career_high
          } AS player1
        }
        CALL (p2) {
          MATCH (p2)-[:REPRESENTS]->(c)
          OPTIONAL MATCH (p2)-[:TURNED_PRO]->(y:Year)
          OPTIONAL MATCH (p2)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t:Match)-[:PLAYED]->(:Round {round: 'Final'})
          WITH p2, y, c, COUNT(DISTINCT(t)) as titles
          RETURN {
            name: p2.first_name || ' ' || p2.last_name,
            id: p2.id,
            wl: toString(p2.win) || '/' || toString(p2.loss),
            wl_pc: toInteger(round(p2.win / (toFloat(p2.win) + toFloat(p2.loss)) * 100, 0)),
            pm: p2.pm_USD,
            rh: p2.rh,
            bh: p2.bh1,
            country: c.id,
            pro: toString(y.id),
            titles: toString(titles),
            dob: apoc.temporal.format(p2.dob, 'dd/MM/yy'),
            height: p2.height_cm,
            ch: p2.career_high
          } AS player2
        }
        OPTIONAL MATCH (p1)-[:ENTERED]->(:Entry)-[:SCORED]->(s1:Score)-[:SCORED]->(m)<-[:SCORED]-(s2:Score)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2)
        OPTIONAL MATCH (w:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(m)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
        OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:TOOK_PLACE_IN]->(y:Year)
        WITH player1, player2, t, e, m, w, r, s, y, s1, s2
        ORDER BY e.start_date
        WITH player1, player2, {
          tname: t.name,
          tid: toString(t.id),
          eid: toString(e.id),
          mid: toString(m.match_no),
          winner: w.id,
          winner_name: w.first_name || ' ' || w.last_name,
          round: r.round,
          surface: s.id,
          year: toString(y.id),
          s1: toString(s1.s1) || toString(s2.s1),
          s2: toString(s1.s2) || toString(s2.s2),
          s3: toString(s1.s3) || toString(s2.s3),
          s4: toString(s1.s4) || toString(s2.s4),
          s5: toString(s1.s5) || toString(s2.s5),
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
          incomplete: CASE
            WHEN s1.incomplete IS NOT NULL THEN s1.incomplete
            WHEN s2.incomplete IS NOT NULL THEN s2.incomplete
            ELSE NULL
          END
        } AS match
        WITH player1, player2, COLLECT(DISTINCT match) as matches
        RETURN {
        p1: player1,
        p2: player2,
        matches: matches
        } AS h2h
      `,
        { p1Id, p2Id }
    );

    const results = records.map((record) => record.toObject());

    return results[0].h2h;
});
