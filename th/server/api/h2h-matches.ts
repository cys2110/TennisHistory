export default defineEventHandler(async query => {
  const { p1Id, p2Id } = getQuery(query)

  const { records: matchesDetails } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p1:Player {id: $p1Id})-[:ENTERED]->(:Entry)-[:SCORED]->(s1:Score)-[:SCORED]->(m)<-[:SCORED]-(s2:Score)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2:Player {id: $p2Id})
      OPTIONAL MATCH (w:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(m)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:IN_YEAR]->(y:Year)
      WITH DISTINCT t, e, m, w, r, s, y, s1, s2
        ORDER BY e.start_date
      WITH {
        name: t.name,
        tid: toString(t.id),
        eid: toString(e.id),
        mid: toString(m.match_no),
        winner: w.id,
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
        incomplete: coalesce(s1.incomplete, s2.incomplete, null)
      } AS match
      RETURN match
    `,
    { p1Id, p2Id }
  )

  const matches = matchesDetails.map(match => match.toObject().match)

  return matches
})
