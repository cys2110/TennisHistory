export default defineEventHandler(async event => {
  const { year, id } = getQuery<{ year: string; id: string }>(event)

  const formattedParams = {
    id,
    year: Number(year),
    challenger: CHALLENGER_CATEGORIES
  }

  const { records: statsRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (p:Player {id: $id})-[:ENTERED]->
        (f:Entry)-[:SCORED]->
        (s:Score)-[:SCORED]->
        (m:Best3|Best5)-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event)-[:IN_YEAR]->
        (y:Year {id: $year})
      WHERE m:Singles
      WITH
        *,
        (e:Men OR e:Women) AS isITF,
        (e.atp_category IN $challenger OR e.wta_category IN $challenger) AS isChallenger,
        (e.category IS NULL) AND
        (NOT m:ATP OR e.atp_category IS NULL OR NOT e.atp_category IN $challenger) AND
        (NOT m:WTA OR e.wta_category IS NULL OR NOT e.wta_category IN $challenger) AS isNotChallenger
      WITH
        sum(
          CASE
            WHEN s:Winner AND NOT isITF AND isNotChallenger THEN 1
            ELSE 0
          END) AS tour_wins,
        sum(
          CASE
            WHEN s:Winner AND isChallenger THEN 1
            ELSE 0
          END) AS challenger_wins,
        sum(
          CASE
            WHEN s:Winner AND isITF THEN 1
            ELSE 0
          END) AS itf_wins,
        sum(
          CASE
            WHEN s:Loser AND NOT isITF AND isNotChallenger THEN 1
            ELSE 0
          END) AS tour_losses,
        sum(
          CASE
            WHEN s:Loser AND isChallenger THEN 1
            ELSE 0
          END) AS challenger_losses,
        sum(
          CASE
            WHEN s:Loser AND isITF THEN 1
            ELSE 0
          END) AS itf_losses,
        sum(
          CASE
            WHEN
              s:Winner AND r.round = 'Final' AND NOT isITF AND isNotChallenger
              THEN 1
            ELSE 0
          END
        ) AS tour_titles,
        sum(
          CASE
            WHEN s:Winner AND r.round = 'Final' AND isChallenger THEN 1
            ELSE 0
          END
        ) AS challenger_titles,
        sum(
          CASE
            WHEN s:Winner AND r.round = 'Final' AND isITF THEN 1
            ELSE 0
          END) AS itf_titles
      RETURN
        [
          {
            category: 'Wins',
            tour: tour_wins,
            challenger: challenger_wins,
            itf: itf_wins
          },
          {
            category: 'Losses',
            tour: tour_losses,
            challenger: challenger_losses,
            itf: itf_losses
          },
          {
            category: 'Titles',
            tour: tour_titles,
            challenger: challenger_titles,
            itf: itf_titles
          }
        ] AS stats
    `,
    formattedParams
  )

  const { records: activityRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (p:Player {id: $id})-[:ENTERED]->
        (f:Entry)-[:SCORED]->
        (s:Score)-[:SCORED]->
        (m:Singles)-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event)-[:IN_YEAR]->
        (:Year {id: $year})
      MATCH (t:Tournament)<-[:EDITION_OF]-(e)
      WITH
        *,
        apoc.coll.min(
          [
            e.start_date,
            e.atp_start_date,
            e.wta_start_date,
            e.men_start_date,
            e.women_start_date
          ]
        ) AS start_date
      ORDER BY start_date, r.number DESC, m.match_no DESC
      CALL (e, m) {
        OPTIONAL MATCH (e)-[:ON_SURFACE]->(z:Surface)
        OPTIONAL MATCH (m)-[:PLAYED]->(:Tie)-[:ON_SURFACE]->(z1:Surface)
        RETURN
          CASE
            WHEN z IS NOT NULL THEN apoc.any.properties(z)
            ELSE apoc.any.properties(z1)
          END AS surface
      }
      CALL (e, m) {
        OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        OPTIONAL MATCH
          (m)-[:PLAYED]->
          (:Tie)-[:TOOK_PLACE_IN]->
          (v1:Venue)-[:LOCATED_IN]->
          (c1:Country)
        WITH
          CASE
            WHEN
              v IS NOT NULL
              THEN
                apoc.map.merge(
                  apoc.any.properties(v),
                  {country: apoc.any.properties(c)}
                )
            ELSE
              apoc.map.merge(
                apoc.any.properties(v1),
                {country: apoc.any.properties(c1)}
              )
          END AS location
        RETURN COLLECT(location) AS locations
      }
      CALL (m, s, r, e) {
        OPTIONAL MATCH
          (m)<-[:SCORED]-(os:Score)<-[:SCORED]-(of:Entry)<-[:ENTERED]-(op:Player)
        WHERE op.id <> $id
        MATCH (m)<-[:SCORED]-(:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
        CALL (op, e) {
          OPTIONAL MATCH (op)-[:REPRESENTS]->(oc:Country)
          OPTIONAL MATCH (op)-[ox:REPRESENTED]->(on:Country)
          RETURN
            CASE
              WHEN
                ox IS NOT NULL AND
                (ox.start_date <= e.start_date OR
                  (op:ATP AND
                    (ox.start_date <= e.atp_start_date OR
                      ox.start_date <= e.men_start_date)) OR
                  (op:WTA AND
                    (ox.start_date <= e.wta_start_date OR
                      ox.start_date <= e.women_start_date))) AND
                (ox.end_date > e.start_date OR
                  (op:ATP AND
                    (ox.end_date > e.atp_start_date OR ox.end_date > e.men_start_date)) OR
                  (op:WTA AND
                    (ox.end_date > e.wta_start_date OR
                      ox.end_date > e.women_start_date)))
                THEN apoc.any.properties(on)
              ELSE apoc.any.properties(oc)
            END AS country
        }
        WITH
          *,
          CASE
            WHEN op IS NULL THEN null
            ELSE
              apoc.map.mergeList(
                [
                  apoc.any.properties(of),
                  apoc.any.properties(op),
                  {
                    country: country,
                    incomplete: coalesce(s.incomplete, os.incomplete, null)
                  }
                ]
              )
          END AS opponent
        RETURN
          {
            labels: labels(m),
            round: r.round,
            match_no: m.match_no,
            incomplete: m.incomplete,
            winner_id: w.id,
            sets:
              [
                [
                  [s.s1, s.t1],
                  [s.s2, s.t2],
                  [s.s3, s.t3],
                  [s.s4, s.t4],
                  [s.s5, s.t5]
                ],
                [
                  [os.s1, os.t1],
                  [os.s2, os.t2],
                  [os.s3, os.t3],
                  [os.s4, os.t4],
                  [os.s5, os.t5]
                ]
              ],
            opponent: opponent,
            stats: CASE WHEN s.serve1 IS NULL THEN FALSE ELSE TRUE END
          } AS match
      }
      WITH e, t, surface, f, COLLECT(DISTINCT match) AS matches, locations
      RETURN
        apoc.map.merge(
          apoc.any.properties(e),
          {
            tours: [x IN labels(e) WHERE NOT x IN ['Event', 'Update']],
            level: CASE
              WHEN e:Men OR e:Women THEN 'ITF'
              WHEN (e:ATP AND e.atp_category IN $challenger) OR (e:WTA AND e.wta_category IN $challenger) THEN 'Challenger'
              ELSE 'Tour'
            END,
            tournament: apoc.any.properties(t),
            venues: locations,
            surface: surface,
            matches: matches,
            player: apoc.any.properties(f)
          }
        ) AS event
    `,
    formattedParams
  )

  const statsResults = statsRecords[0].get("stats")
  const activityResults = activityRecords.map(record => record.get("event"))

  for (const event of activityResults) {
    const dateKeys = [
      "start_date",
      "end_date",
      "atp_start_date",
      "atp_end_date",
      "wta_start_date",
      "wta_end_date",
      "men_start_date",
      "men_end_date",
      "women_start_date",
      "women_end_date"
    ]

    event["id"] = event["id"].toInt()
    event["tournament"]["id"] = event["tournament"]["id"].toInt()
    event["player"]["seed"] = event["player"]["seed"]?.toInt()
    event["player"]["rank"] = event["player"]["rank"]?.toInt()
    event["player"]["points"] = event["player"]["points"]?.toInt()
    event["player"]["q_seed"] = event["player"]["q_seed"]?.toInt()
    event["player"]["pm"] = event["player"]["pm"]?.toInt()

    for (const key of dateKeys) {
      if (event[key]) {
        event[key] = {
          year: event[key].year?.toInt(),
          month: event[key].month?.toInt(),
          day: event[key].day?.toInt()
        }
      }
    }

    for (const match of event.matches) {
      match["match_no"] = match["match_no"].toInt()
      match["opponent"] =
        match["opponent"] ?
          {
            ...match["opponent"],
            seed: match["opponent"]["seed"]?.toInt(),
            rank: match["opponent"]["rank"]?.toInt(),
            q_seed: match["opponent"]["q_seed"]?.toInt()
          }
        : null

      for (let i = 0; i < 2; i++) {
        for (let index = 4; index >= 0; index--) {
          // Delete keys with null values in the array
          if (match.sets[i][index][0] === null) {
            match.sets[i].splice(index, 1)
          } else {
            match.sets[i][index] = match.sets[i][index].map((item: any) => (item ? item.toInt() : null))
          }
        }
      }
    }
  }

  return {
    stats: statsResults.map((stat: any) => ({
      category: stat.category,
      tour: stat.tour.toInt(),
      challenger: stat.challenger.toInt(),
      itf: stat.itf.toInt()
    })),
    activity: activityResults
  }
})
