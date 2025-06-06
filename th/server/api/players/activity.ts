export default defineEventHandler(async event => {
  const { year, id } = getQuery<{ year: string; id: string }>(event)

  const formattedParams = {
    id,
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
      WITH p, f, s, m, r, e, t, z
      ORDER BY e.start_date, m.match_no DESC
      CALL (e) {
        MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        WITH {
          id: v.id,
          name: v.name,
          city: v.city,
          country: {
            id: c.id,
            name: c.name,
            alpha2: c.alpha2
          }} AS location
        RETURN COLLECT(location) AS locations
      }
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
          match_no: toString(m.match_no),
          incomplete: m.incomplete,
          winner_id: w.id,
          sets: [toString(s.s1) || toString(os.s1), toString(s.s2) || toString(os.s2), toString(s.s3) || toString(os.s3), toString(s.s4) || toString(os.s4), toString(s.s5) || toString(os.s5)],
          tbs: [
            CASE WHEN s.t1 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t1, os.t1] WHERE x IS NOT NULL])) ELSE NULL END,
            CASE WHEN s.t2 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t2, os.t2] WHERE x IS NOT NULL])) ELSE NULL END,
            CASE WHEN s.t3 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t3, os.t3] WHERE x IS NOT NULL])) ELSE NULL END,
            CASE WHEN s.t4 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t4, os.t4] WHERE x IS NOT NULL])) ELSE NULL END,
            CASE WHEN s.t5 IS NOT NULL THEN toString(apoc.coll.min([x IN [s.t5, os.t5] WHERE x IS NOT NULL])) ELSE NULL END
          ],
          opponent: {
            id: op.id,
            name: op.first_name || ' ' || op.last_name,
            country: country,
            incomplete: coalesce(s.incomplete, os.incomplete, null),
            seed: toString(of.seed),
            status: of.status,
            rank: toString(of.rank)
          }
        } AS match
      }
      WITH e, t, z, f, COLLECT(DISTINCT match) AS matches, locations
      RETURN {
        tournament: {name: t.name, id: toString(t.id)},
        id: toString(e.id),
        name: e.sponsor_name,
        dates: CASE
          WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM YYYY') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM YYYY')
          WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM YYYY')
          ELSE apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM YYYY')
        END,
        category: e.category,
        venues: locations,
        surface: {id: z.id, surface: z.surface},
        currency: e.currency,
        matches: matches,
        draw_type: e.draw_type,
        player: {
          seed: toString(f.seed),
          status: f.status,
          rank: toString(f.rank),
          points: toString(f.points),
          pm: apoc.number.format(f.pm, '#,###')
        }
      } AS event
    `,
    formattedParams
  )

  const statsResults = statsRecords[0].toObject()
  const activityResults = activityRecords.map(record => record.get("event"))

  return { stats: statsResults.stats, activity: activityResults }
})
