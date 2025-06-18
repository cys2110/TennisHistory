export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  // TODO: Remove start date guards
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament {id: $id})<-[:EDITION_OF]-(e:Event) WHERE e.start_date IS NOT NULL OR e.atp_start_date IS NOT NULL OR e.wta_start_date IS NOT NULL
      MATCH (e)-[:IN_YEAR]->(y:Year)
      WITH *
      ORDER BY y.id
      CALL (e) {
        OPTIONAL MATCH
          (m:Singles)-[:PLAYED]->(r:ATP|Men {round: 'Final'})-[:ROUND_OF]->(e) WHERE r:Singles
        OPTIONAL MATCH
          (winner:ATP)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (ws:Winner)-[:SCORED]->
          (m)<-[:SCORED]-
          (ls:Loser)<-[:SCORED]-
          (:Entry)<-[:ENTERED]-
          (loser:ATP)
        OPTIONAL MATCH (winner)-[f:REPRESENTED]->(z:Country)
        OPTIONAL MATCH (winner)-[g:REPRESENTS]->(q:Country)
        OPTIONAL MATCH (loser)-[f1:REPRESENTED]->(z1:Country)
        OPTIONAL MATCH (loser)-[g1:REPRESENTS]->(q1:Country)
        WITH
          *,
          CASE
            WHEN
              f IS NOT NULL AND
              f.start_date <= e.start_date AND
              f.end_date > e.start_date
              THEN {id: z.id, name: z.name, alpha2: z.alpha2}
            ELSE {id: q.id, name: q.name, alpha2: q.alpha2}
          END AS winner_country,
          CASE
            WHEN
              f1 IS NOT NULL AND
              f1.start_date <= e.start_date AND
              f1.end_date > e.start_date
              THEN {id: z1.id, name: z1.name, alpha2: z1.alpha2}
            ELSE {id: q1.id, name: q1.name, alpha2: q1.alpha2}
          END AS loser_country
        WITH
          {
            id: winner.id,
            name: winner.first_name || ' ' || winner.last_name,
            country: winner_country
          } AS winner,
          {
            id: loser.id,
            name: loser.first_name || ' ' || loser.last_name,
            country: loser_country
          } AS loser,
          ws,
          ls,
          m
        RETURN
          CASE
            WHEN
              ws IS NOT NULL
              THEN
                {
                  winner: winner,
                  loser: loser,
                  sets:
                    [
                      toString(ws.s1) || toString(ls.s1),
                      toString(ws.s2) || toString(ls.s2),
                      toString(ws.s3) || toString(ls.s3),
                      toString(ws.s4) || toString(ls.s4),
                      toString(ws.s5) || toString(ls.s5)
                    ],
                  tbs:
                    [
                      CASE
                        WHEN
                          ws.t1 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t1, ls.t1]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t2 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t2, ls.t2]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t3 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t3, ls.t3]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t4 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t4, ls.t4]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t5 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t5, ls.t5]))
                        ELSE null
                      END
                    ],
                  incomplete: ls.incomplete
                }
            WHEN m IS NOT NULL THEN 'No final played'
            ELSE null
          END AS ms
      }
      CALL (e) {
        OPTIONAL MATCH
          (m:Doubles)-[:PLAYED]->(r:ATP|Men {round: 'Final'})-[:ROUND_OF]->(e) WHERE r:Doubles
        OPTIONAL MATCH
          (winner:ATP)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (ws:Winner)-[:SCORED]->
          (m)<-[:SCORED]-
          (ls:Loser)<-[:SCORED]-
          (:Entry)<-[:ENTERED]-
          (loser:ATP)
        OPTIONAL MATCH (winner)-[f:REPRESENTED]->(z:Country)
        OPTIONAL MATCH (winner)-[g:REPRESENTS]->(q:Country)
        OPTIONAL MATCH (loser)-[f1:REPRESENTED]->(z1:Country)
        OPTIONAL MATCH (loser)-[g1:REPRESENTS]->(q1:Country)
        WITH
          *,
          CASE
            WHEN
              f IS NOT NULL AND
              f.start_date <= e.start_date AND
              f.end_date > e.start_date
              THEN {id: z.id, name: z.name, alpha2: z.alpha2}
            ELSE {id: q.id, name: q.name, alpha2: q.alpha2}
          END AS winner_country,
          CASE
            WHEN
              f1 IS NOT NULL AND
              f1.start_date <= e.start_date AND
              f1.end_date > e.start_date
              THEN {id: z1.id, name: z1.name, alpha2: z1.alpha2}
            ELSE {id: q1.id, name: q1.name, alpha2: q1.alpha2}
          END AS loser_country
        WITH
          COLLECT(
            DISTINCT
            {
              id: winner.id,
              name: winner.first_name || ' ' || winner.last_name,
              country: winner_country
            }
          ) AS winner,
          COLLECT(
            DISTINCT
            {
              id: loser.id,
              name: loser.first_name || ' ' || loser.last_name,
              country: loser_country
            }
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
                  winner: winner,
                  loser: loser,
                  sets:
                    [
                      toString(ws.s1) || toString(ls.s1),
                      toString(ws.s2) || toString(ls.s2),
                      toString(ws.s3) || toString(ls.s3),
                      toString(ws.s4) || toString(ls.s4),
                      toString(ws.s5) || toString(ls.s5)
                    ],
                  tbs:
                    [
                      CASE
                        WHEN
                          ws.t1 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t1, ls.t1]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t2 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t2, ls.t2]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t3 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t3, ls.t3]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t4 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t4, ls.t4]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t5 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t5, ls.t5]))
                        ELSE null
                      END
                    ],
                  incomplete: ls.incomplete
                }
            WHEN m IS NOT NULL THEN 'No final played'
            ELSE null
          END AS md
      }
      CALL (e) {
        OPTIONAL MATCH
          (m:Singles)-[:PLAYED]->(r:WTA|Women {round: 'Final'})-[:ROUND_OF]->(e) WHERE r:Singles
        OPTIONAL MATCH
          (winner:WTA)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (ws:Winner)-[:SCORED]->
          (m)<-[:SCORED]-
          (ls:Loser)<-[:SCORED]-
          (:Entry)<-[:ENTERED]-
          (loser:WTA)
        OPTIONAL MATCH (winner)-[f:REPRESENTED]->(z:Country)
        OPTIONAL MATCH (winner)-[g:REPRESENTS]->(q:Country)
        OPTIONAL MATCH (loser)-[f1:REPRESENTED]->(z1:Country)
        OPTIONAL MATCH (loser)-[g1:REPRESENTS]->(q1:Country)
        WITH
          *,
          CASE
            WHEN
              f IS NOT NULL AND
              f.start_date <= e.start_date AND
              f.end_date > e.start_date
              THEN {id: z.id, name: z.name, alpha2: z.alpha2}
            ELSE {id: q.id, name: q.name, alpha2: q.alpha2}
          END AS winner_country,
          CASE
            WHEN
              f1 IS NOT NULL AND
              f1.start_date <= e.start_date AND
              f1.end_date > e.start_date
              THEN {id: z1.id, name: z1.name, alpha2: z1.alpha2}
            ELSE {id: q1.id, name: q1.name, alpha2: q1.alpha2}
          END AS loser_country
        WITH
          {
            id: winner.id,
            name: winner.first_name || ' ' || winner.last_name,
            country: winner_country
          } AS winner,
          {
            id: loser.id,
            name: loser.first_name || ' ' || loser.last_name,
            country: loser_country
          } AS loser,
          ws,
          ls,
          m
        RETURN
          CASE
            WHEN
              ws IS NOT NULL
              THEN
                {
                  winner: winner,
                  loser: loser,
                  sets:
                    [
                      toString(ws.s1) || toString(ls.s1),
                      toString(ws.s2) || toString(ls.s2),
                      toString(ws.s3) || toString(ls.s3),
                      toString(ws.s4) || toString(ls.s4),
                      toString(ws.s5) || toString(ls.s5)
                    ],
                  tbs:
                    [
                      CASE
                        WHEN
                          ws.t1 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t1, ls.t1]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t2 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t2, ls.t2]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t3 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t3, ls.t3]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t4 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t4, ls.t4]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t5 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t5, ls.t5]))
                        ELSE null
                      END
                    ],
                  incomplete: ls.incomplete
                }
            WHEN m IS NOT NULL THEN 'No final played'
            ELSE null
          END AS ladies_singles
      }
      CALL (e) {
        OPTIONAL MATCH
          (m:Doubles)-[:PLAYED]->(r:WTA|Women {round: 'Final'})-[:ROUND_OF]->(e) WHERE r:Doubles
        OPTIONAL MATCH
          (winner:WTA)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (ws:Winner)-[:SCORED]->
          (m)<-[:SCORED]-
          (ls:Loser)<-[:SCORED]-
          (:Entry)<-[:ENTERED]-
          (loser:WTA)
        OPTIONAL MATCH (winner)-[f:REPRESENTED]->(z:Country)
        OPTIONAL MATCH (winner)-[g:REPRESENTS]->(q:Country)
        OPTIONAL MATCH (loser)-[f1:REPRESENTED]->(z1:Country)
        OPTIONAL MATCH (loser)-[g1:REPRESENTS]->(q1:Country)
        WITH
          *,
          CASE
            WHEN
              f IS NOT NULL AND
              f.start_date <= e.start_date AND
              f.end_date > e.start_date
              THEN {id: z.id, name: z.name, alpha2: z.alpha2}
            ELSE {id: q.id, name: q.name, alpha2: q.alpha2}
          END AS winner_country,
          CASE
            WHEN
              f1 IS NOT NULL AND
              f1.start_date <= e.start_date AND
              f1.end_date > e.start_date
              THEN {id: z1.id, name: z1.name, alpha2: z1.alpha2}
            ELSE {id: q1.id, name: q1.name, alpha2: q1.alpha2}
          END AS loser_country
        WITH
          COLLECT(
            DISTINCT
            {
              id: winner.id,
              name: winner.first_name || ' ' || winner.last_name,
              country: winner_country
            }
          ) AS winner,
          COLLECT(
            DISTINCT
            {
              id: loser.id,
              name: loser.first_name || ' ' || loser.last_name,
              country: loser_country
            }
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
                  winner: winner,
                  loser: loser,
                  sets:
                    [
                      toString(ws.s1) || toString(ls.s1),
                      toString(ws.s2) || toString(ls.s2),
                      toString(ws.s3) || toString(ls.s3),
                      toString(ws.s4) || toString(ls.s4),
                      toString(ws.s5) || toString(ls.s5)
                    ],
                  tbs:
                    [
                      CASE
                        WHEN
                          ws.t1 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t1, ls.t1]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t2 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t2, ls.t2]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t3 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t3, ls.t3]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t4 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t4, ls.t4]))
                        ELSE null
                      END,
                      CASE
                        WHEN
                          ws.t5 IS NOT NULL
                          THEN toString(apoc.coll.min([ws.t5, ls.t5]))
                        ELSE null
                      END
                    ],
                  incomplete: ls.incomplete
                }
            WHEN m IS NOT NULL THEN 'No final played'
            ELSE null
          END AS ld
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
                  c1: {id: c1.id, name: c1.name, alpha2: c1.alpha2},
                  c2: {id: c2.id, name: c2.name, alpha2: c2.alpha2},
                  score: x.score
                }
            ELSE null
          END AS country
      }
      RETURN
        {
          tours: labels(e),
          id: e.id,
          year: y.id,
          md: md,
          ld: ld,
          ms: ms,
          ls: ladies_singles,
          country: country
        } AS event
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.get("event"))

  return results.map((event: any) => ({
    ...event,
    id: event.id.low,
    year: event.year.low
  }))
})
