import driver from './driver'

const getTournamentDetails = async (tid: string) => {

  const { records } = await driver.executeQuery(
    `/* cypher */
        MATCH (t:Tournament {id: $id})-[:ESTABLISHED]->(e:Year)
        OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
        MATCH (t)<-[:EDITION_OF]-(x:Event)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        WITH t, a, e, x, v, c
        ORDER BY x.start_date
        WITH COLLECT(DISTINCT {name: v.name, city: v.city, country: c.id}) AS venues, COLLECT(DISTINCT x.sponsor_name) AS names, t, a, e
        WITH {
        name: t.name,
        website: t.website,
        years: CASE
            WHEN a.id IS NULL THEN toString(e.id) || ' - present'
            WHEN a.id = e.id THEN toString(e.id)
            ELSE toString(e.id) || ' - ' || toString(a.id)
        END,
        names: names,
        venues: venues
        } AS tournament, t
        MATCH (t)<-[:EDITION_OF]-(x:Event)
        MATCH (v:Venue)<-[:TOOK_PLACE_IN]-(x)-[:TOOK_PLACE_IN]->(y:Year)
        WITH x, v, y, tournament
        ORDER BY y.id
        OPTIONAL MATCH (x)<-[:ROUND_OF]-(:Round {round: 'Final'})<-[:PLAYED]-(m:Match)<-[:SCORED]-(ws:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
        CALL (w, x) {
        OPTIONAL MATCH (w)-[f:REPRESENTED]->(z:Country)
        MATCH (w)-[g:REPRESENTS]->(q:Country)
        WITH CASE
            WHEN f IS NOT NULL AND f.start_date <= x.start_date AND f.end_date > x.start_date THEN f.id
            ELSE q.id
        END AS winner_country
        RETURN winner_country
        }
        OPTIONAL MATCH (m)<-[:SCORED]-(ls:Loser)<-[:SCORED]-(:Entry)<-[:ENTERED]-(l:Player)
        CALL (l, x) {
        OPTIONAL MATCH (l)-[f:REPRESENTED]->(z:Country)
        MATCH (l)-[g:REPRESENTS]->(q:Country)
        WITH CASE
            WHEN f IS NOT NULL AND f.start_date <= x.start_date AND f.end_date > x.start_date THEN f.id
            ELSE q.id
        END AS loser_country
        RETURN loser_country
        }
        WITH tournament, COLLECT(DISTINCT {
            eid: toString(x.id),
            year: toString(y.id),
            venue: v.name,
            name: x.sponsor_name,
            match_no: toString(m.match_no),
            winner_name: w.first_name || ' ' || w.last_name,
            winner_id: w.id,
            winner_country: winner_country,
            loser_name: l.first_name || ' ' || l.last_name,
            loser_id: l.id,
            loser_country: loser_country,
            s1: toString(ws.s1) || toString(ls.s1),
            s2: toString(ws.s2) || toString(ls.s2),
            s3: toString(ws.s3) || toString(ls.s3),
            s4: toString(ws.s4) || toString(ls.s4),
            s5: toString(ws.s5) || toString(ls.s5),
            t1: CASE
                WHEN ws.t1 IS NOT NULL THEN toString(apoc.coll.min([ws.t1, ls.t1]))
                ELSE NULL
            END,
            t2: CASE
                WHEN ws.t2 IS NOT NULL THEN toString(apoc.coll.min([ws.t2, ls.t2]))
                ELSE NULL
            END,
            t3: CASE
                WHEN ws.t3 IS NOT NULL THEN toString(apoc.coll.min([ws.t3, ls.t3]))
                ELSE NULL
            END,
            t4: CASE
                WHEN ws.t4 IS NOT NULL THEN toString(apoc.coll.min([ws.t4, ls.t4]))
                ELSE NULL
            END,
            t5: CASE
                WHEN ws.t5 IS NOT NULL THEN toString(apoc.coll.min([ws.t5, ls.t5]))
                ELSE NULL
            END,
            incomplete: ls.incomplete
        }) AS events
        RETURN {tournament: tournament, events: events} AS results
      `,
    {id: parseInt(tid)},
  )

  const events = records.map((record) => record.toObject())

  return events[0].results
}

export default getTournamentDetails