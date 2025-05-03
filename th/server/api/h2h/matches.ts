export default defineEventHandler(async query => {
  const { p1Id, p2Id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p1:Player {id: $p1Id})-[:ENTERED]->(:Entry)-[:SCORED]->(s1:Score)-[:SCORED]->(m)<-[:SCORED]-(s2:Score)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2:Player {id: $p2Id})
      OPTIONAL MATCH (w:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(m)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:IN_YEAR]->(y:Year)
      WITH DISTINCT t, e, m, w, r, s, y, s1, s2
        ORDER BY e.start_date
      CALL (w, e) {
        MATCH (w)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (w)-[x:REPRESENTED]->(c1:Country)
        RETURN CASE
          WHEN x IS NOT NULL AND x.start_date <= e.start_date AND x.end_date > e.start_date THEN {id: c1.id, name: c1.name, alpha2: c1.alpha2}
          ELSE {id: c.id, name: c.name, alpha2: c.alpha2}
        END AS country
      }
      WITH {
        match_no: toString(m.match_no),
        winner: {
          id: w.id,
          name: w.first_name || ' ' || w.last_name,
          country: country
        },
        round: r.round,
        sets: [toString(s1.s1) || toString(s2.s1), toString(s1.s2) || toString(s2.s2), toString(s1.s3) || toString(s2.s3), toString(s1.s4) || toString(s2.s4),   toString(s1.s5) || toString(s2.s5)],
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
      } AS match, t, e, s, y
      RETURN {
        tournament: {
          name: t.name,
          id: toString(t.id)
        },
        id: toString(e.id),
        surface: s.id,
        year: toString(y.id),
        match: match
      } AS event
    `,
    { p1Id, p2Id }
  )

  const matchesObject = records.map(record => record.get("event"))
  const matches = matchesObject.map((event: any) => ({
    ...event,
    match: {
      ...event.match,
      sets: event.match.sets.filter((set: string | null) => set !== null)
    }
  }))

  return matches
})
