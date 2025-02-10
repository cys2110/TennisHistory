export default defineEventHandler(async (query) => {
  const { p1Id, p2Id } = getQuery(query);

  const { records: p1Details } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      MATCH (p)-[:REPRESENTS]->(c)
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(y:Year)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t:Match)-[:PLAYED]->(:Round {round: 'Final'})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(w:Best3 | Best5)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(l:Best3 | Best5)
      WITH p, y, c, COUNT(DISTINCT(t)) AS titles, COUNT(DISTINCT(w)) AS wins, COUNT(DISTINCT(l)) AS losses
      RETURN {
        id: p.id,
        name: p.first_name || ' ' || p.last_name,
        wl: toString(wins) || '/' || toString(losses),
        wl_pc: toString(round(wins / (toFloat(wins) + toFloat(losses)) * 100, 0)),
        pm: toString(p.pm),
        rh: p.rh,
        bh: p.bh,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        pro: toString(y.id),
        titles: toString(titles),
        dob: apoc.temporal.format(p.dob, 'dd/MM/yy'),
        height: toString(p.height),
        ch: toString(p.ch)
      } As p1
    `, { id: p1Id }
  )

  const { records: p2Details } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      MATCH (p)-[:REPRESENTS]->(c)
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(y:Year)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t:Match)-[:PLAYED]->(:Round {round: 'Final'})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(w:Best3 | Best5)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(l:Best3 | Best5)
      WITH p, y, c, COUNT(DISTINCT(t)) AS titles, COUNT(DISTINCT(w)) AS wins, COUNT(DISTINCT(l)) AS losses
      RETURN {
        id: p.id,
        name: p.first_name || ' ' || p.last_name,
        wl: toString(wins) || '/' || toString(losses),
        wl_pc: toString(round(wins / (toFloat(wins) + toFloat(losses)) * 100, 0)),
        pm: toString(p.pm),
        rh: p.rh,
        bh: p.bh,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        pro: toString(y.id),
        titles: toString(titles),
        dob: apoc.temporal.format(p.dob, 'dd/MM/yy'),
        height: toString(p.height),
        ch: toString(p.ch)
      } AS p2
    `, { id: p2Id }
  )

  const { records: matchesDetails } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p1:Player {id: $p1Id})
      MATCH (p2:Player {id: $p2Id})
      OPTIONAL MATCH (p1)-[:ENTERED]->(:Entry)-[:SCORED]->(s1:Score)-[:SCORED]->(m)<-[:SCORED]-(s2:Score)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2)
      OPTIONAL MATCH (w:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(m)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:IN_YEAR]->(y:Year)
      WITH t, e, m, w, r, s, y, s1, s2
        ORDER BY e.start_date
      WITH {
        name: t.name,
        tid: toString(t.id),
        eid: toString(e.id),
        mid: toString(m.match_no),
        winner_id: w.id,
        round: r.round,
        surface: s.id,
        year: toString(y.id),
        sets: [toString(s1.s1) || toString(s2.s1), toString(s1.s2) || toString(s2.s2), toString(s1.s3) || toString(s2.s3), toString(s1.s4) || toString(s2.s4), toString(s1.s5) || toString(s2.s5)],
        tbs: [
          CASE
            WHEN s1.t1 IS NOT NULL THEN toString(apoc.coll.min([s1.t1, s2.t1]))
            ELSE NULL
          END,
          CASE
            WHEN s1.t2 IS NOT NULL THEN toString(apoc.coll.min([s1.t2, s2.t2]))
            ELSE NULL
          END,
          CASE
            WHEN s1.t3 IS NOT NULL THEN toString(apoc.coll.min([s1.t3, s2.t3]))
            ELSE NULL
          END,
          CASE
            WHEN s1.t4 IS NOT NULL THEN toString(apoc.coll.min([s1.t4, s2.t4]))
            ELSE NULL
          END,
          CASE
            WHEN s1.t5 IS NOT NULL THEN toString(apoc.coll.min([s1.t5, s2.t5]))
            ELSE NULL
          END
        ],
        incomplete: CASE
          WHEN s1.incomplete IS NOT NULL THEN s1.incomplete
          WHEN s2.incomplete IS NOT NULL THEN s2.incomplete
          ELSE NULL
        END
      } AS match
      WITH COLLECT(DISTINCT match) as matches
      RETURN matches
    `, { p1Id, p2Id }
  );

  const p1 = p1Details.map((record) => record.toObject());
  const p2 = p2Details.map((record) => record.toObject());
  const matches = matchesDetails.map((record) => record.toObject());

  return { p1: p1[0].p1, p2: p2[0].p2, matches: matches[0].matches };
});
