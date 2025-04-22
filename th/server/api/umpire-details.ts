export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    year: string
  }

  const { id, year } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:Umpire {id: $id})-[:UMPIRED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year {id: $year})
      MATCH (e)-[:EDITION_OF]->(t:Tournament)
      MATCH (p1:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:P1)-[:SCORED]->(m)<-[:SCORED]-(:P2)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p2:Player)
      WITH m, r, e, t, p1, p2, y, u
        ORDER BY t.name, e.start_date DESC, r.number DESC
      WITH {
        mid: toString(m.match_no),
        p1: p1.first_name || ' ' || p1.last_name,
        p2: p2.first_name || ' ' || p2.last_name
      } AS match, r, t, e, y, u
      WITH r, t, e, COLLECT(match) AS matches, y, u
      WITH t, e, y, u, {
        round: r.round,
        matches: matches
      } AS round
      WITH t, e, COLLECT(round) AS rounds, y, u
      RETURN {
        name: t.name,
        tid: toString(t.id),
        eid: toString(e.id),
        draw_type: e.draw_type,
        year: toString(y.id),
        rounds: rounds
      } AS event, labels(u) AS labels
    `,
    { id, year: Number(year) }
  )

  const tournaments = records.map(record => record.get("event"))
  const labels = records[0].get("labels")

  return { results: tournaments, labels }
})
