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
            tid: tid,
            year: y.id,
            round: CASE
              WHEN best_match.score:Winner AND best_match.round.round = 'Final' THEN 'Win'
              ELSE best_match.round.round
            END
          }
        END
      ) AS resultsPerTid
      RETURN apoc.map.fromPairs(collect([tid, [x IN resultsPerTid WHERE x IS NOT NULL][0..]])) AS results
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
            tid: tid,
            year: y.id,
            round: CASE
              WHEN best_match.score:Winner AND best_match.round.round = 'Final' THEN 'Win'
              ELSE best_match.round.round
            END
          }
        END
      ) AS resultsPerTid
      RETURN apoc.map.fromPairs(collect([tid, [x IN resultsPerTid WHERE x IS NOT NULL][0..]])) AS results
    `,
    { id }
  )

  const singlesResults = singlesRecords[0].get("results")
  const doublesResults = doublesRecords[0].get("results")

  for (const [key, value] of Object.entries(singlesResults)) {
    singlesResults[key] = (value as any[]).map(result => ({
      ...result,
      id: result.id?.low ?? null,
      year: result.year?.low ?? null,
      tournament: {
        ...result.tournament,
        id: result.tournament?.id?.low ?? null
      }
    }))
  }

  for (const [key, value] of Object.entries(doublesResults)) {
    doublesResults[key] = (value as any[]).map(result => ({
      ...result,
      id: result.id?.low ?? null,
      year: result.year?.low ?? null,
      tournament: {
        ...result.tournament,
        id: result.tournament?.id?.low ?? null
      }
    }))
  }

  return { singles: singlesResults, doubles: doublesResults }
})
