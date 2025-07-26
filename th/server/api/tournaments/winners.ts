export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  // TODO: Remove start date guards
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)
      WHERE
        SIZE(
          [
            x IN
            [
              e.start_date,
              e.atp_start_date,
              e.wta_start_date,
              e.men_start_date,
              e.women_start_date
            ]
            WHERE x IS NOT NULL
          ]
        ) >
        0
      MATCH (e)-[:IN_YEAR]->(y:Year)
      WITH *, [x IN labels(e) WHERE NOT x IN ['Update', 'Event']] AS tours
      ORDER BY y.id
      UNWIND tours AS tour
      CALL (e, tour) {
        OPTIONAL MATCH
          (m:Singles)-[:PLAYED]->
          (r:$ (tour):Singles {round: 'Final'})-[:ROUND_OF]->
          (e)
        OPTIONAL MATCH
          (winner:$ (tour))-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (ws:Winner)-[:SCORED]->
          (m)<-[:SCORED]-
          (ls:Loser)<-[:SCORED]-
          (:Entry)<-[:ENTERED]-
          (loser:$ (tour))
        OPTIONAL MATCH (winner)-[f:REPRESENTED]->(z:Country)
        OPTIONAL MATCH (winner)-[g:REPRESENTS]->(q:Country)
        OPTIONAL MATCH (loser)-[f1:REPRESENTED]->(z1:Country)
        OPTIONAL MATCH (loser)-[g1:REPRESENTS]->(q1:Country)
        WITH
          *,
          CASE
            WHEN
              f IS NOT NULL AND
              (f.start_date <= e.start_date OR
                (winner:ATP AND
                  (f.start_date <= e.atp_start_date OR
                    f.start_date <= e.men_start_date)) OR
                (winner:WTA AND
                  (f.start_date <= e.wta_start_date OR
                    f.start_date <= e.women_start_date))) AND
              (f.end_date > e.start_date OR
                (winner:ATP AND
                  (f.end_date > e.atp_start_date OR f.end_date > e.men_start_date)) OR
                (winner:WTA AND
                  (f.end_date > e.wta_start_date OR f.end_date > e.women_start_date)))
              THEN apoc.any.properties(z)
            ELSE apoc.any.properties(q)
          END AS winner_country,
          CASE
            WHEN
              f1 IS NOT NULL AND
              (f1.start_date <= e.start_date OR
                (loser:ATP AND
                  (f1.start_date <= e.atp_start_date OR
                    f1.start_date <= e.men_start_date)) OR
                (loser:WTA AND
                  (f1.start_date <= e.wta_start_date OR
                    f1.start_date <= e.women_start_date))) AND
              (f1.end_date > e.start_date OR
                (loser:ATP AND
                  (f1.end_date > e.atp_start_date OR f1.end_date > e.men_start_date)) OR
                (loser:WTA AND
                  (f1.end_date > e.wta_start_date OR
                    f1.end_date > e.women_start_date)))
              THEN apoc.any.properties(z1)
            ELSE apoc.any.properties(q1)
          END AS loser_country
        WITH
          apoc.map.merge(apoc.any.properties(winner), {country: winner_country}) AS winner,
          apoc.map.merge(apoc.any.properties(loser), {country: loser_country}) AS loser,
          ws,
          ls,
          m
        RETURN
          CASE
            WHEN
              ws IS NOT NULL
              THEN
                {
                  labels: labels(m),
                  tour: tour,
                  winner: winner,
                  loser: loser,
                  sets:
                    [
                      [
                        [ws.s1, ws.t1],
                        [ws.s2, ws.t2],
                        [ws.s3, ws.t3],
                        [ws.s4, ws.t4],
                        [ws.s5, ws.t5]
                      ],
                      [
                        [ls.s1, ls.t1],
                        [ls.s2, ls.t2],
                        [ls.s3, ls.t3],
                        [ls.s4, ls.t4],
                        [ls.s5, ls.t5]
                      ]
                    ],
                  incomplete: ls.incomplete,
                  stats: CASE
                    WHEN ws.serve1 IS NULL THEN FALSE
                    ELSE TRUE
                  END
                }
            WHEN m IS NOT NULL THEN {tour: tour, winner: 'No final played'}
            ELSE null
          END AS singles
      }
      CALL (e, tour) {
        OPTIONAL MATCH
          (m:Doubles)-[:PLAYED]->
          (r:$ (tour):Doubles {round: 'Final'})-[:ROUND_OF]->
          (e)
        OPTIONAL MATCH
          (winner:$ (tour))-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (ws:Winner)-[:SCORED]->
          (m)<-[:SCORED]-
          (ls:Loser)<-[:SCORED]-
          (:Entry)<-[:ENTERED]-
          (loser:$ (tour))
        OPTIONAL MATCH (winner)-[f:REPRESENTED]->(z:Country)
        OPTIONAL MATCH (winner)-[g:REPRESENTS]->(q:Country)
        OPTIONAL MATCH (loser)-[f1:REPRESENTED]->(z1:Country)
        OPTIONAL MATCH (loser)-[g1:REPRESENTS]->(q1:Country)
        WITH
          *,
          CASE
            WHEN
              f IS NOT NULL AND
              (f.start_date <= e.start_date OR
                (winner:ATP AND
                  (f.start_date <= e.atp_start_date OR
                    f.start_date <= e.men_start_date)) OR
                (winner:WTA AND
                  (f.start_date <= e.wta_start_date OR
                    f.start_date <= e.women_start_date))) AND
              (f.end_date > e.start_date OR
                (winner:ATP AND
                  (f.end_date > e.atp_start_date OR f.end_date > e.men_start_date)) OR
                (winner:WTA AND
                  (f.end_date > e.wta_start_date OR f.end_date > e.women_start_date)))
              THEN apoc.any.properties(z)
            ELSE apoc.any.properties(q)
          END AS winner_country,
          CASE
            WHEN
              f1 IS NOT NULL AND
              (f1.start_date <= e.start_date OR
                (loser:ATP AND
                  (f1.start_date <= e.atp_start_date OR
                    f1.start_date <= e.men_start_date)) OR
                (loser:WTA AND
                  (f1.start_date <= e.wta_start_date OR
                    f1.start_date <= e.women_start_date))) AND
              (f1.end_date > e.start_date OR
                (loser:ATP AND
                  (f1.end_date > e.atp_start_date OR f1.end_date > e.men_start_date)) OR
                (loser:WTA AND
                  (f1.end_date > e.wta_start_date OR
                    f1.end_date > e.women_start_date)))
              THEN apoc.any.properties(z1)
            ELSE apoc.any.properties(q1)
          END AS loser_country
        WITH
          COLLECT(
            DISTINCT
            apoc.map.merge(apoc.any.properties(winner), {country: winner_country})
          ) AS winner,
          COLLECT(
            DISTINCT
            apoc.map.merge(apoc.any.properties(loser), {country: loser_country})
          ) AS loser,
          ws,
          ls,
          m
        RETURN
          CASE
            WHEN
              ws IS NOT NULL
              THEN
                {
                  labels: labels(m),
                  tour: tour,
                  winner: winner,
                  loser: loser,
                  sets:
                    [
                      [
                        [ws.s1, ws.t1],
                        [ws.s2, ws.t2],
                        [ws.s3, ws.t3],
                        [ws.s4, ws.t4],
                        [ws.s5, ws.t5]
                      ],
                      [
                        [ls.s1, ls.t1],
                        [ls.s2, ls.t2],
                        [ls.s3, ls.t3],
                        [ls.s4, ls.t4],
                        [ls.s5, ls.t5]
                      ]
                    ],
                  incomplete: ls.incomplete,
                  stats: CASE
                    WHEN ws.serve1 IS NULL THEN FALSE
                    ELSE TRUE
                  END
                }
            WHEN m IS NOT NULL THEN {tour: tour, winner: 'No final played'}
            ELSE null
          END AS doubles
      }
      CALL (e) {
        OPTIONAL MATCH (x:Tie)-[:TIE_OF]->(r:Round {round: 'Final'})-[:ROUND_OF]->(e)
        OPTIONAL MATCH (c1:Country {id: x.c1})
        OPTIONAL MATCH (c2:Country {id: x.c2})
        RETURN
          CASE
            WHEN
              x IS NOT NULL
              THEN
                {
                  c1: apoc.any.properties(c1),
                  c2: apoc.any.properties(c2),
                  score: x.score
                }
            ELSE null
          END AS country
      }
      WITH
        y.id AS year,
        COLLECT(singles) AS singles,
        COLLECT(doubles) AS doubles,
        country,
        e
      RETURN
        {
          year: year,
          singles: singles,
          doubles: doubles,
          country: country,
          tours: [x IN labels(e) WHERE NOT x IN ['Update', 'Event']],
          id: e.id
        } AS event
    `,
    { id: Number(id) }
  )

  const results = records.map(record => {
    const event = record.get("event")
    event["id"] = event["id"].toInt()
    event["year"] = event["year"].toInt()

    if (event["singles"].length) {
      for (const singles of event["singles"]) {
        if (singles.sets) {
          for (let i = 0; i < 2; i++) {
            for (let index = 4; index >= 0; index--) {
              // Delete keys with null values in the array
              if (singles.sets[i][index][0] === null) {
                singles.sets[i].splice(index, 1)
              } else {
                singles.sets[i][index] = singles.sets[i][index].map((item: any) => (item ? item.toInt() : null))
              }
            }
          }
        }
      }
    }

    if (event["doubles"].length) {
      for (const doubles of event["doubles"]) {
        if (doubles.sets) {
          for (let i = 0; i < 2; i++) {
            for (let index = 4; index >= 0; index--) {
              // Delete keys with null values in the array
              if (doubles.sets[i][index][0] === null) {
                doubles.sets[i].splice(index, 1)
              } else {
                doubles.sets[i][index] = doubles.sets[i][index].map((item: any) => (item ? item.toInt() : null))
              }
            }
          }
        }
      }
    }
    return event
  })

  return results
})
