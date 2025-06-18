export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      CALL (p) {
        OPTIONAL MATCH
          (p)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (:Winner)-[:SCORED]->
          (m:Singles)-[:PLAYED]->
          (:Round {round: 'Final'})-[:ROUND_OF]->
          (e:Event)-[:IN_YEAR]->
          (y:Year)
        OPTIONAL MATCH (e)-[:EDITION_OF]->(t:Tournament)
        WITH *
        ORDER BY e.start_date
        WITH
          CASE
            WHEN e IS NULL THEN null
            ELSE
              {
                id: e.id,
                tournament: {id: t.id, name: t.name},
                category:
                  CASE
                    WHEN e.category IS NOT NULL THEN e.category
                    WHEN m:ATP THEN e.atp_category
                    ELSE e.wta_category
                  END,
                year: y.id,
                date:
                  CASE
                    WHEN e.end_date IS NOT NULL THEN apoc.temporal.format(e.end_date, 'yyyy-MM-dd')
                    WHEN m:ATP THEN apoc.temporal.format(e.atp_end_date, 'yyyy-MM-dd')
                    ELSE apoc.temporal.format(e.wta_end_date, 'yyyy-MM-dd')
                  END
              }
          END AS tournament
        RETURN COLLECT(tournament) AS singles_tournaments
      }
      CALL (p) {
        OPTIONAL MATCH
          (p)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (:Winner)-[:SCORED]->
          (m:Doubles)-[:PLAYED]->
          (:Round {round: 'Final'})-[:ROUND_OF]->
          (e:Event)-[:IN_YEAR]->
          (y:Year)
        OPTIONAL MATCH (e)-[:EDITION_OF]->(t:Tournament)
        WITH *
        ORDER BY e.start_date
        WITH
          CASE
            WHEN e IS NULL THEN null
            ELSE
              {
                id: e.id,
                tournament: {id: t.id, name: t.name},
                category:
                  CASE
                    WHEN e.category IS NOT NULL THEN e.category
                    WHEN m:ATP THEN e.atp_category
                    ELSE e.wta_category
                  END,
                year: y.id,
                date:
                  CASE
                    WHEN e.end_date IS NOT NULL THEN apoc.temporal.format(e.end_date, 'yyyy-MM-dd')
                    WHEN m:ATP THEN apoc.temporal.format(e.atp_end_date, 'yyyy-MM-dd')
                    ELSE apoc.temporal.format(e.wta_end_date, 'yyyy-MM-dd')
                  END
              }
          END AS tournament
        RETURN COLLECT(tournament) AS doubles_tournaments
      }
      RETURN singles_tournaments, doubles_tournaments
    `,
    { id }
  )

  const results = records[0].toObject()

  return {
    singles: results.singles_tournaments.map((t: any) => ({
      ...t,
      year: t.year.low,
      id: t.id,
      tournament: {
        ...t.tournament,
        id: t.tournament.id
      }
    }))
  }
})
