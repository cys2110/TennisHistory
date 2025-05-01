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
      CALL (p1, e) {
        MATCH (p1)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p1)-[c2:REPRESENTED]->(c3:Country)
        RETURN CASE
          WHEN c2 IS NOT NULL AND c2.start_date <= e.start_date AND c2.end_date > e.start_date THEN {id: c3.id, name: c3.name, alpha2: c3.alpha2}
          ELSE {id: c.id, name: c.name, alpha2: c.alpha2}
        END AS c1
      }
      CALL (p2, e) {
        MATCH (p2)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p2)-[c3:REPRESENTED]->(c4:Country)
        RETURN CASE
          WHEN c3 IS NOT NULL AND c3.start_date <= e.start_date AND c3.end_date > e.start_date THEN {id: c4.id, name: c4.name, alpha2: c4.alpha2}
          ELSE {id: c.id, name: c.name, alpha2: c.alpha2}
        END AS c2
      }
      WITH {
        match_no: toString(m.match_no),
        p1: {
          id: p1.id,
          name: p1.first_name || ' ' || p1.last_name,
          country: c1
        },
        p2: {
          id: p2.id,
          name: p2.first_name || ' ' || p2.last_name,
          country: c2
        }
      } AS match, r, t, e, y, u
      WITH r, t, e, COLLECT(match) AS matches, y, u
      WITH t, e, y, u, {
        round: r.round,
        matches: matches
      } AS round
      WITH t, e, COLLECT(round) AS rounds, y, u
      RETURN {
        id: toString(e.id),
        tournament: {
          id: toString(t.id),
          name: t.name
        },
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
