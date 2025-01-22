export default defineEventHandler(async (event) => {
  const { year, id } = getQuery<{ year: string; id: string }>(event);

  const formattedParams = {
    id: id,
    year: parseInt(year)
  };

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(f:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:TOOK_PLACE_IN]->(:Year {id: $year})
      MATCH (t:Tournament)<-[:EDITION_OF]-(e)-[:ON_SURFACE]->(z:Surface)
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH p, f, s, m, r, e, t, z, v, c
        ORDER BY e.start_date, m.match_no DESC
      CALL (m, s, r) {
        OPTIONAL MATCH (m)<-[:SCORED]-(os:Score)<-[:SCORED]-(of:Entry)<-[:ENTERED]-(op:Player)-[:REPRESENTS]->(oc:Country) WHERE op.id <> $id
        MATCH (m)<-[:SCORED]-(:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
        RETURN {
          round: r.round,
          match_no: toString(m.match_no),
          incomplete: m.incomplete,
          country: oc.id,
          id: op.id,
          name: op.first_name || ' ' || op.last_name,
          seed: toString(of.seed),
          status: of.status,
          rank: toString(of.rank),
          winner: w.id,
          s1: toString(s.s1) || toString(os.s1),
          s2: toString(s.s2) || toString(os.s2),
          s3: toString(s.s3) || toString(os.s3),
          s4: toString(s.s4) || toString(os.s4),
          s5: toString(s.s5) || toString(os.s5),
          t1: CASE WHEN s.t1 IS NOT NULL THEN toString(apoc.coll.min([s.t1, os.t1])) ELSE NULL END,
          t2: CASE WHEN s.t2 IS NOT NULL THEN toString(apoc.coll.min([s.t2, os.t2])) ELSE NULL END,
          t3: CASE WHEN s.t3 IS NOT NULL THEN toString(apoc.coll.min([s.t3, os.t3])) ELSE NULL END,
          t4: CASE WHEN s.t4 IS NOT NULL THEN toString(apoc.coll.min([s.t4, os.t4])) ELSE NULL END,
          t5: CASE WHEN s.t5 IS NOT NULL THEN toString(apoc.coll.min([s.t5, os.t5])) ELSE NULL END,
          player_incomplete: coalesce(s.incomplete, os.incomplete, null)
        } AS match
      }
      WITH e, t, z, v, c, f, COLLECT(match) AS matches
      WITH e, t, z, v, c, f, matches
      RETURN COLLECT(DISTINCT {
        name: t.name,
        tid: toString(t.id),
        eid: toString(e.id),
        ename: e.sponsor_name,
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM YYYY') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM YYYY')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM YYYY')
          ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM YYYY')
        END,
        category: e.category,
        city: v.city,
        country: c.id,
        surface: z.id,
        seed: toString(f.seed),
        status: f.status,
        rank: toString(f.rank),
        points: toString(f.points),
        pm: apoc.number.format(f.pm, '#,###'),
        currency: e.currency,
        matches: matches
      }) AS events
    `,
    formattedParams
  );

  const events = records.map((record) => record.toObject());

  return events[0].events;
});
