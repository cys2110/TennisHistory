import { percentage } from "~/utils/helpers"

export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)<-[:ROUND_OF]-(:Round {round: 'Final'})<-[:PLAYED]-(:Match)<-[:SCORED]-(:Winner)<-[:SCORED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
      MATCH (e)-[:IN_YEAR]->(y:Year)
      WITH e, p, f, y, c
      MATCH (f)-[:SCORED]->(s:Score)-[:SCORED]->(:Match)<-[:SCORED]-(s1:Score)
      WITH
        p, c,
        y.id AS year,
        SUM(
          coalesce(s.s1, 0) +
          coalesce(s.s2, 0) +
          coalesce(s.s3, 0) +
          coalesce(s.s4, 0) +
          coalesce(s.s5, 0)
        ) AS games_won,
        SUM(
          coalesce(s1.s1, 0) +
          coalesce(s1.s2, 0) +
          coalesce(s1.s3, 0) +
          coalesce(s1.s4, 0) +
          coalesce(s1.s5, 0)
        ) AS games_lost,
        SUM(
          CASE WHEN s.s1 > s1.s1 THEN 1 ELSE 0 END +
          CASE WHEN s.s2 > s1.s2 THEN 1 ELSE 0 END +
          CASE WHEN s.s3 > s1.s3 THEN 1 ELSE 0 END +
          CASE WHEN s.s4 > s1.s4 THEN 1 ELSE 0 END +
          CASE WHEN s.s5 > s1.s5 THEN 1 ELSE 0 END
        ) AS sets_won,
        SUM(
          CASE WHEN s.s1 < s1.s1 THEN 1 ELSE 0 END +
          CASE WHEN s.s2 < s1.s2 THEN 1 ELSE 0 END +
          CASE WHEN s.s3 < s1.s3 THEN 1 ELSE 0 END +
          CASE WHEN s.s4 < s1.s4 THEN 1 ELSE 0 END +
          CASE WHEN s.s5 < s1.s5 THEN 1 ELSE 0 END
        ) AS sets_lost

      WITH
        year,
        p,
        c,
        games_won,
        games_lost, sets_won, sets_lost
      ORDER BY sets_lost
      RETURN {
      year: year,
      player: {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}},
      sets_won: sets_won,
      sets_lost: sets_lost,
      games_won: games_won,
      games_lost: games_lost
      } AS scores_stats
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.toObject().scores_stats)

  const numberResults = results.map(result => {
    for (const [key, value] of Object.entries(result)) {
      if (value === null || value === undefined) {
        delete result[key]
      } else if (key === "player") {
        result[key] = value
      } else {
        // @ts-ignore
        result[key] = value.low
      }
    }

    return result
  })

  const addedPercentages = numberResults.map(result => {
    const sets_pc = percentage(result.sets_won, result.sets_won + result.sets_lost)
    const games_pc = percentage(result.games_won, result.games_won + result.games_lost)

    return {
      ...result,
      sets_pc,
      games_pc
    }
  })
  return addedPercentages
})
