export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Umpire {id: $id})-[:UMPIRED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
      MATCH (e)-[:IN_YEAR]->(y:Year)
      MATCH (p1:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:P1)-[:SCORED]->(m)<-[:SCORED]-(:P2)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2:Player)
      WITH m, r, e, t, p1, p2, y
        ORDER BY t.name, e.start_date DESC, r.number DESC
      WITH {
        mid: toString(m.match_no),
        p1: p1.first_name || ' ' || p1.last_name,
        p2: p2.first_name || ' ' || p2.last_name
      } AS match, r, t, e, y
      WITH r, t, e, COLLECT(match) AS matches, y
      WITH t, e, y, {
        round: r.round,
        matches: matches
      } AS round
      WITH t, e, COLLECT(round) AS rounds, y
      WITH t, {
        eid: toString(e.id),
        draw_type: e.draw_type,
        year: toString(y.id),
        rounds: rounds
      } AS event
      WITH t, COLLECT(event) AS events
      RETURN {
        name: t.name,
        tid: toString(t.id),
        events: events
      } as tournament
    `,
    { id }
  )

  const tournaments = records.map(record => record.get("tournament"))

  return tournaments
})
