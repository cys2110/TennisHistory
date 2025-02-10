export default defineEventHandler(async(query) => {
  const { tid } = getQuery<{ tid: string }>(query);

  // Get tournament details
  const { records: tournamentResults } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament {id: $id})-[:ESTABLISHED]->(e:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
      RETURN {
        name: t.name,
        website: t.website,
        years: CASE
            WHEN a.id IS NULL THEN toString(e.id) || ' - present'
            WHEN a.id = e.id THEN toString(e.id)
            ELSE toString(e.id) || ' - ' || toString(a.id)
        END
      } AS tournament
    `, { id: parseInt(tid)}
  )

  // Get tournament events
  const { records: eventResults } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year)<-[:IN_YEAR]-(e:Event)-[:EDITION_OF]->(t:Tournament {id: $id})
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH e, y, v, c
        ORDER BY y.id
      CALL (e, y) {
        OPTIONAL MATCH (e)<-[:ROUND_OF]-(r:Round {round: 'Final'})<-[:PLAYED]-(m:Match)<-[:SCORED]-(ws:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
        OPTIONAL MATCH (m)<-[:SCORED]-(ls:Loser)<-[:SCORED]-(:Entry)<-[:ENTERED]-(l:Player)
        CALL (w, e) {
          OPTIONAL MATCH (w)-[f:REPRESENTED]->(z:Country)
          MATCH (w)-[g:REPRESENTS]->(q:Country)
          RETURN CASE
            WHEN f IS NOT NULL AND f.start_date <= e.start_date AND f.end_date > e.start_date THEN {id: f.id, alpha2: f.alpha2}
            ELSE {id: q.id, alpha2: q.alpha2}
          END AS winner_country
        }
        CALL (e, l) {
          OPTIONAL MATCH (l)-[f:REPRESENTED]->(z:Country)
          MATCH (l)-[g:REPRESENTS]->(q:Country)
          RETURN CASE
            WHEN f IS NOT NULL AND f.start_date <= e.start_date AND f.end_date > e.start_date THEN {id: f.id, alpha2: f.alpha2}
            ELSE {id: q.id, alpha2: q.alpha2}
          END AS loser_country
        }
        RETURN {
          eid: toString(e.id),
          year: toString(y.id),
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
        } AS event
      }
      WITH
        COLLECT({name: e.sponsor_name, year: toString(y.id)}) AS names,
        COLLECT({venue: v.name, city: v.city, country: { id: c.id, alpha2: c.alpha2, name: c.name}, year: toString(y.id)}) AS venues,
        COLLECT(event) AS events
      RETURN {
        names: names,
        venues: venues,
        events: events
      } AS events
    `, { id: parseInt(tid)}
  )

  const tournament = tournamentResults.map((record) => record.toObject())
  const eventsAggregate = eventResults.map((record) => record.toObject())

  const names = Object.values(eventsAggregate[0].events.names.reduce((acc: any, {name, year}: any) => {
    if (!acc[name]) {
      acc[name] = { name, start: year, end: year}
    } else {
      acc[name].end = year
    }
    return acc
  }, {}))
  const venues = Object.values(eventsAggregate[0].events.venues.reduce((acc: any, {venue, city, country, year}: any) => {
    if (!acc[venue]) {
      acc[venue] = { venue, city, country, start: year, end: year}
    } else {
      acc[venue].end = year
    }
    return acc
  }, {}))

  return {tournament: tournament[0].tournament, names, venues, events: eventsAggregate[0].events.events}

})
