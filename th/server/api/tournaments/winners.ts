export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year)<-[:IN_YEAR]-(e:Event)-[:EDITION_OF]->(t:Tournament {id: $id})
      OPTIONAL MATCH (e)<-[:ROUND_OF]-(r:Round {round: 'Final'})<-[:PLAYED]-(m:Match)<-[:SCORED]-(ws:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
      OPTIONAL MATCH (m)<-[:SCORED]-(ls:Loser)<-[:SCORED]-(:Entry)<-[:ENTERED]-(l:Player)
      WITH DISTINCT e, y, t, w, l, ws, ls
        ORDER BY y.id
      CALL (w, e) {
        OPTIONAL MATCH (w)-[f:REPRESENTED]->(z:Country)
        MATCH (w)-[g:REPRESENTS]->(q:Country)
        RETURN CASE
          WHEN f IS NOT NULL AND f.start_date <= e.start_date AND f.end_date > e.start_date THEN {id: z.id, name: z.name, alpha2: z.alpha2}
          ELSE {id: q.id, name: q.name, alpha2: q.alpha2}
        END AS winner_country
      }
      CALL (e, l) {
        OPTIONAL MATCH (l)-[f:REPRESENTED]->(z:Country)
        MATCH (l)-[g:REPRESENTS]->(q:Country)
        RETURN CASE
          WHEN f IS NOT NULL AND f.start_date <= e.start_date AND f.end_date > e.start_date THEN {id: z.id, name: z.name, alpha2: z.alpha2}
          ELSE {id: q.id, name: q.name, alpha2: q.alpha2}
        END AS loser_country
      }
      RETURN {
          id: toString(e.id),
          year: toString(y.id),
          match: {
            sets: [toString(ws.s1) || toString(ls.s1), toString(ws.s2) || toString(ls.s2), toString(ws.s3) || toString(ls.s3), toString(ws.s4) || toString(ls.s4), toString(ws.s5) || toString(ls.s5)],
            tbs: [
              CASE
                WHEN ws.t1 IS NOT NULL THEN toString(apoc.coll.min([ws.t1, ls.t1]))
                ELSE NULL
              END,
              CASE
                WHEN ws.t2 IS NOT NULL THEN toString(apoc.coll.min([ws.t2, ls.t2]))
                ELSE NULL
              END,
              CASE
                WHEN ws.t3 IS NOT NULL THEN toString(apoc.coll.min([ws.t3, ls.t3]))
                ELSE NULL
              END,
              CASE
                WHEN ws.t4 IS NOT NULL THEN toString(apoc.coll.min([ws.t4, ls.t4]))
                ELSE NULL
              END,
              CASE
                WHEN ws.t5 IS NOT NULL THEN toString(apoc.coll.min([ws.t5, ls.t5]))
                ELSE NULL
              END
            ],
            incomplete: ls.incomplete
          },
          winner: CASE
            WHEN w IS NOT NULL THEN {
              name: w.first_name || ' ' || w.last_name,
              id: w.id,
              country: winner_country
            }
            ELSE NULL
          END,
          loser: CASE
            WHEN l IS NOT NULL THEN {
              name: l.first_name || ' ' || l.last_name,
              id: l.id,
              country: loser_country
            }
          ELSE NULL
          END,
          draw_type: e.draw_type
        } AS event
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.get("event"))

  return results
})
