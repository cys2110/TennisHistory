export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (u:Umpire)-[:UMPIRED]->
        (m:Singles|Doubles)-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event)-[:IN_YEAR]->
        (y:Year)
      WHERE apoc.text.compareCleaned(u.id, $id)
      OPTIONAL MATCH (e)-[:EDITION_OF]->(t:Tournament)
      MATCH
        (p1:Player)-[:ENTERED]->
        (:Entry)-[:SCORED]->
        (score:P1|T1)-[:SCORED]->
        (m)<-[:SCORED]-
        (:P2|T2)<-[:SCORED]-
        (:Entry)<-[:ENTERED]-
        (p2:Player)
      WITH DISTINCT
        *,
        apoc.coll.min([e.start_date, e.atp_start_date, e.wta_start_date, e.men_start_date, e.women_start_date]) AS start_date
      WHERE
        e.start_date IS NOT NULL OR
        e.atp_start_date IS NOT NULL OR
        e.wta_start_date IS NOT NULL OR
        e.men_start_date IS NOT NULL OR
        e.women_start_date IS NOT NULL
      ORDER BY start_date, r.number DESC, m.match_no ASC
      CALL (p1, e) {
        MATCH (p1)-[:REPRESENTS]->(cz:Country)
        OPTIONAL MATCH (p1)-[c2:REPRESENTED]->(c3:Country)
        RETURN
          CASE
            WHEN
              c2 IS NOT NULL AND
              (c2.start_date <= e.start_date OR (p1:ATP AND (c2.start_date <= e.atp_start_date OR c2.start_date <= e.men_start_date)) OR (p1:WTA AND (c2.start_date <= e.wta_start_date OR c2.start_date <= e.women_start_date))) AND
              (c2.end_date > e.start_date OR (p1:ATP AND (c2.end_date > e.atp_start_date OR c2.end_date > e.men_start_date)) OR (p1:WTA AND (c2.end_date > e.wta_start_date OR c2.end_date > e.women_start_date)))
              THEN apoc.any.properties(c3)
            ELSE apoc.any.properties(cz)
          END AS c1
      }
      CALL (p2, e) {
        MATCH (p2)-[:REPRESENTS]->(cz:Country)
        OPTIONAL MATCH (p2)-[c3:REPRESENTED]->(c4:Country)
        RETURN
          CASE
            WHEN
              c3 IS NOT NULL AND
              (c3.start_date <= e.start_date OR (p2:ATP AND (c3.start_date <= e.atp_start_date OR c3.start_date <= e.men_start_date)) OR (p2:WTA AND (c3.start_date <= e.wta_start_date OR c3.start_date <= e.women_start_date))) AND
              (c3.end_date > e.start_date OR (p2:ATP AND (c3.end_date > e.atp_start_date OR c3.end_date > e.men_start_date)) OR (p2:WTA AND (c3.end_date > e.wta_start_date OR c3.end_date > e.women_start_date)))
              THEN apoc.any.properties(c4)
            ELSE apoc.any.properties(cz)
          END AS c2
      }
      WITH
        m,
        r,
        t,
        e,
        y,
        COLLECT(DISTINCT apoc.map.merge(apoc.any.properties(p1), {country: c1})) AS p1,
        COLLECT(DISTINCT apoc.map.merge(apoc.any.properties(p2), {country: c2})) AS p2,
        CASE
          WHEN score.serve1 IS NOT NULL THEN true
          ELSE false
        END AS stats
      WITH r, t, e, COLLECT(DISTINCT apoc.map.merge(
          apoc.any.properties(m),
          {labels: labels(m), p1: p1, p2: p2, stats: stats}
        )) AS matches, y
      WITH t, e, COLLECT(DISTINCT {round: r.round, matches: matches}) AS rounds, y
      RETURN DISTINCT
        apoc.map.merge(
          apoc.any.properties(e),
          {
            tournament: apoc.any.properties(t),
            tours: [x IN labels(e) WHERE NOT x IN ['Update', 'Event']],
            year: y.id,
            rounds: rounds
          }
        ) AS event
    `,
    { id }
  )

  const results = records.map(record => record.get("event"))

  for (const event of results) {
    const consolidatedRounds: any[] = []
    const usedRounds = new Set<string>()
    for (const round of event.rounds) {
      if (!usedRounds.has(round.round)) {
        const sharedRounds = event.rounds.filter((r: any) => r.round === round.round)
        const consolidatedMatches = sharedRounds.reduce((acc: any[], r: any) => {
          return acc.concat(r.matches)
        }, [])
        consolidatedRounds.push({
          round: round.round,
          matches: consolidatedMatches
        })
        usedRounds.add(round.round)
      }
    }
    event.rounds = consolidatedRounds
  }

  return results.map(event => ({
    ...event,
    id: event.id.toInt(),
    year: event.year.toInt(),
    tournament: {
      ...event.tournament,
      id: event.tournament.id.toInt()
    },
    rounds: event.rounds.map((round: any) => ({
      ...round,
      matches: round.matches.map((match: any) => ({
        ...match,
        match_no: match.match_no?.toInt()
      }))
    }))
  }))
})
