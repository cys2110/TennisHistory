export default defineEventHandler(async event => {
  const { year, id } = getQuery<{ year: string; id: string }>(event)

  const formattedParams = {
    id: id,
    year: Number(year)
  }

  const { records: statsRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(f:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Best3|Best5)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year {id: $year})
      WITH sum(CASE WHEN s:Winner THEN 1 ELSE 0 END) AS wins, sum(CASE WHEN s:Loser THEN 1 ELSE 0 END) AS losses, sum(CASE WHEN s:Winner AND r.round = 'Final' THEN 1 ELSE 0 END) AS titles
      RETURN [
          { category: 'Wins', value: toString(wins) },
          { category: 'Losses', value: toString(losses) },
          { category: 'Titles', value: toString(titles) }
      ] AS stats
    `,
    formattedParams
  )

  const { records: activityRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(f:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(:Year {id: $year})
      MATCH (t:Tournament)<-[:EDITION_OF]-(e)-[:ON_SURFACE]->(z:Surface)
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH p, f, s, m, r, e, t, z, v, c
        ORDER BY e.start_date, m.match_no DESC
      CALL (m, s, r, e) {
        OPTIONAL MATCH (m)<-[:SCORED]-(os:Score)<-[:SCORED]-(of:Entry)<-[:ENTERED]-(op:Player) WHERE op.id <> $id
        MATCH (m)<-[:SCORED]-(:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
        CALL (op, e) {
          MATCH (op)-[:REPRESENTS]->(oc:Country)
          OPTIONAL MATCH (op)-[ox:REPRESENTED]->(on:Country)
          RETURN CASE
            WHEN ox IS NOT NULL AND ox.start_date <= e.start_date AND ox.end_date > e.start_date THEN {id: on.id, alpha2: on.alpha2, name: on.name}
            ELSE {id: oc.id, alpha2: oc.alpha2, name: oc.name}
          END AS country
        }
        RETURN {
          round: r.round,
          mid: toString(m.match_no),
          incomplete: m.incomplete,
          country: country,
          id: op.id,
          name: op.first_name || ' ' || op.last_name,
          seed: toString(of.seed),
          status: of.status,
          rank: toString(of.rank),
          winner: w.id,
          sets: [toString(s.s1) || toString(os.s1), toString(s.s2) || toString(os.s2), toString(s.s3) || toString(os.s3), toString(s.s4) || toString(os.s4), toString(s.s5) || toString(os.s5)],
          tbs: [
            CASE WHEN s.t1 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t1, os.t1] WHERE x IS NOT NULL])) ELSE NULL END,
            CASE WHEN s.t2 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t2, os.t2] WHERE x IS NOT NULL])) ELSE NULL END,
            CASE WHEN s.t3 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t3, os.t3] WHERE x IS NOT NULL])) ELSE NULL END,
            CASE WHEN s.t4 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t4, os.t4] WHERE x IS NOT NULL])) ELSE NULL END,
            CASE WHEN s.t5 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t5, os.t5] WHERE x IS NOT NULL])) ELSE NULL END
          ],
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
        venue: {
          city: v.city,
          country: {
            id: c.id,
            name: c.name,
            alpha2: c.alpha2
          }
        },
        surface: z.id,
        seed: toString(f.seed),
        status: f.status,
        rank: toString(f.rank),
        points: toString(f.points),
        pm: apoc.number.format(f.pm, '#,###'),
        currency: e.currency,
        matches: matches,
        draw_type: e.draw_type
      }) AS events
    `,
    formattedParams
  )

  const statsResults = statsRecords[0].toObject()
  const activityResults = activityRecords[0].toObject()

  return { stats: statsResults.stats, activity: activityResults.events }
})
