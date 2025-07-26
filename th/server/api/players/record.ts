export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records: singlesRecords } = await useDriver().executeQuery(
    `/* cypher */
      WITH [580, 520, 540, 560, 605, 96] AS tournamentIds
      MATCH (p:Player {id: $id})
      UNWIND tournamentIds AS tid
      MATCH (t:Tournament {id: tid})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Singles)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t)
      OPTIONAL MATCH (e)-[:IN_YEAR]->(y:Year)
      WITH *
        ORDER BY e.start_date
      WITH tid, t, e, y,
          collect({round: r, score: s}) AS match_data
      WITH tid, t, e, y,
          reduce(minNum = 999, x IN match_data | CASE WHEN x.round.number IS NOT NULL AND x.round.number < minNum THEN x.round.number ELSE minNum END) AS min_round,
          match_data
      WITH tid, t, y, e, min_round,
          head([x IN match_data WHERE x.round.number = min_round]) AS best_match
      WITH tid, COLLECT(
        CASE
          WHEN e IS NOT NULL THEN {
            id: e.id,
            tournament: {id: t.id, name: t.name},
            year: y.id,
            round: CASE
              WHEN best_match.score:Winner AND best_match.round.round = 'Final' THEN 'Win'
              ELSE best_match.round.round
            END,
            number: CASE
              WHEN best_match.score:Winner AND best_match.round.round = 'Final' THEN 0
              ELSE best_match.round.number
            END
          }
        END
      ) AS resultsPerTid
      RETURN resultsPerTid, tid
    `,
    { id }
  )

  const { records: doublesRecords } = await useDriver().executeQuery(
    `/* cypher */
      WITH [580, 520, 540, 560, 605, 96] AS tournamentIds
      MATCH (p:Player {id: $id})
      UNWIND tournamentIds AS tid
      MATCH (t:Tournament {id: tid})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Doubles)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t)
      OPTIONAL MATCH (e)-[:IN_YEAR]->(y:Year)
      WITH *
        ORDER BY e.start_date
      WITH tid, t, e, y.id as year,
          collect({round: r, score: s}) AS match_data
      WITH tid, t, e, year,
          reduce(minNum = 999, x IN match_data | CASE WHEN x.round.number IS NOT NULL AND x.round.number < minNum THEN x.round.number ELSE minNum END) AS min_round,
          match_data
      WITH tid, t, year, e, min_round,
          head([x IN match_data WHERE x.round.number = min_round]) AS best_match
      WITH tid, COLLECT(
        CASE
          WHEN e IS NOT NULL THEN {
            id: e.id,
            tournament: {id: t.id, name: t.name},
            year: year,
            round: CASE
              WHEN best_match.score:Winner AND best_match.round.round = 'Final' THEN 'Win'
              ELSE best_match.round.round
            END,
            number: CASE
              WHEN best_match.score:Winner AND best_match.round.round = 'Final' THEN 0
              ELSE best_match.round.number
            END
          }
        END
      ) AS resultsPerTid
      RETURN resultsPerTid, tid
    `,
    { id }
  )

  const singlesResults = singlesRecords.map(record => record.toObject())
  const doublesResults = doublesRecords.map(record => record.toObject())

  for (const result of singlesResults) {
    for (const event of result.resultsPerTid) {
      event["id"] = event.id.toInt()
      event["year"] = event.year?.toInt()
      event["tournament"] = {
        ...event.tournament,
        id: event.tournament.id?.toInt()
      }
      event["number"] = event.number?.toInt()
    }
    result["tid"] = result.tid.toInt()
  }

  for (const result of doublesResults) {
    for (const event of result.resultsPerTid) {
      event["id"] = event.id.toInt()
      event["year"] = event.year?.toInt()
      event["tournament"] = {
        ...event.tournament,
        id: event.tournament.id?.toInt()
      }
      event["number"] = event.number?.toInt()
    }
    result["tid"] = result.tid.toInt()
  }

  return { singles: singlesResults, doubles: doublesResults }
})
