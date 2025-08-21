export default defineEventHandler(async query => {
  const { id, tour, type } = getQuery<{ id: string; tour: TourType; type: MatchType }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})<-[:ROUND_OF]-(r:Round: $ ($tour): $ ($type))
      WHERE r.number > 0 AND r.round <> 'Qualifier'
      WITH r, e
      ORDER BY r.number DESC
      CALL (r, e) {
        MATCH (r)<-[:PLAYED]-(m:Best3|Best5)<-[:SCORED]-(ws:Winner)
        OPTIONAL MATCH
          (ws)<-[:SCORED]-
          (wf:Entry)<-[:ENTERED]-
          (wp:Player)-[:REPRESENTS]->
          (c:Country)
        OPTIONAL MATCH
          (m)<-[:SCORED]-
          (ls:Loser)<-[:SCORED]-
          (lf:Entry)<-[:ENTERED]-
          (lp:Player)-[:REPRESENTS]->
          (c1:Country)
        OPTIONAL MATCH (u:Umpire)-[:UMPIRED]->(m)
        OPTIONAL MATCH
          (wp)-
            [wt:REPRESENTED WHERE
              (wt.start_date <= e.start_date AND wt.end_date > e.start_date) OR
              ('ATP' IN labels(wp) AND
                wt.start_date <= coalesce(e.atp_start_date, e.men_start_date) AND
                wt.end_date > coalesce(e.atp_start_date, e.men_start_date)) OR
              ('WTA' IN labels(wp) AND
                wt.start_date <= coalesce(e.wta_start_date, e.women_start_date) AND
                wt.end_date > coalesce(e.wta_start_date, e.women_start_date))]->
          (n:Country)
        OPTIONAL MATCH
          (lp)-
            [lt:REPRESENTED WHERE
              (lt.start_date <= e.start_date AND lt.end_date > e.start_date) OR
              ('ATP' IN labels(lp) AND
                lt.start_date <= coalesce(e.atp_start_date, e.men_start_date) AND
                lt.end_date > coalesce(e.atp_start_date, e.men_start_date)) OR
              ('WTA' IN labels(lp) AND
                lt.start_date <= coalesce(e.wta_start_date, e.women_start_date) AND
                lt.end_date > coalesce(e.wta_start_date, e.women_start_date))]->
          (n1:Country)
        WITH
          m,
          wf,
          wp,
          CASE
            WHEN wt IS NULL THEN properties(c)
            ELSE properties(n)
          END AS winner_country,
          lf,
          lp,
          CASE
            WHEN lt IS NULL THEN properties(c1)
            ELSE properties(n1)
          END AS loser_country,
          ws,
          u,
          ls
        WITH
          m,
          ls,
          MIN(wf.rank) AS min_winner_rank,
          MIN(lf.rank) AS min_loser_rank,
          COLLECT(
            DISTINCT
            apoc.map.mergeList([
              properties(wf),
              properties(wp),
              {country: winner_country}
            ])) AS winners,
          COLLECT(
            DISTINCT
            apoc.map.mergeList([
              properties(lf),
              properties(lp),
              {country: loser_country}
            ])) AS losers,
          u,
          [
            [ws.s1, ws.t1],
            [ws.s2, ws.t2],
            [ws.s3, ws.t3],
            [ws.s4, ws.t4],
            [ws.s5, ws.t5]
          ] AS winner_sets,
          [
            [ls.s1, ls.t1],
            [ls.s2, ls.t2],
            [ls.s3, ls.t3],
            [ls.s4, ls.t4],
            [ls.s5, ls.t5]
          ] AS loser_sets,
          CASE WHEN ws.serve1 IS NULL THEN false ELSE true END AS stats
        WITH
          ls,
          m,
          winners,
          losers,
          u,
          winner_sets,
          loser_sets,
          stats,
          CASE
            WHEN
              coalesce(min_winner_rank, 1e9) < coalesce(min_loser_rank, 1e9)
              THEN coalesce(min_winner_rank, 1e9)
            ELSE coalesce(min_loser_rank, 1e9)
          END AS sort_rank
        ORDER BY sort_rank, m.number
        WITH
          apoc.map.merge(
            properties(m),
            {
              umpire: u.id,
              stats: stats,
              winners: {
                players: winners,
                sets: [x IN winner_sets WHERE x[0] IS NOT NULL]
              },
              losers: {
                players: losers,
                sets: [x IN loser_sets WHERE x[0] IS NOT NULL],
                incomplete: ls.incomplete
              }
            }
          ) AS match
        RETURN COLLECT(match) AS matches
      }
      RETURN {title: r.round, matches: matches} AS round
    `,
    { id: Number(id), tour, type }
  )

  const rounds = records.map(record => {
    const round = record.get("round")

    for (const match of round.matches) {
      match.match_no = match.match_no.toInt()

      if (match.date) {
        match.date = {
          year: match.date.year.toInt(),
          month: match.date.month.toInt(),
          day: match.date.day.toInt()
        }
      }

      if (match.duration) {
        match.duration = convertDuration(match.duration.seconds.toInt())
      }

      const numberKeys = ["rank", "seed", "q_seed"]

      for (const player of match.winners.players) {
        for (const key of numberKeys) {
          if (player[key]) {
            player[key] = player[key].toInt()
          }
        }
      }

      for (const player of match.losers.players) {
        for (const key of numberKeys) {
          if (player[key]) {
            player[key] = player[key].toInt()
          }
        }
      }

      for (const set of match.winners.sets) {
        if (set[0]) {
          set[0] = set[0].toInt()
        }
        if (set[1]) {
          set[1] = set[1].toInt()
        }
      }

      for (const set of match.losers.sets) {
        if (set[0]) {
          set[0] = set[0].toInt()
        }
        if (set[1]) {
          set[1] = set[1].toInt()
        }
      }
    }

    return round
  })

  return rounds
})
