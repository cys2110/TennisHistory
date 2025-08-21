export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
      (e:Event {id: $id})<-[:ROUND_OF]-
      (r:Round)<-[:PLAYED]-
      (m:Best3|Best5)<-[:SCORED]-
      (ws:Winner)<-[:SCORED]-
      (wf:Entry)<-[:ENTERED]-
      (wp:Player)-[:REPRESENTS]->
      (c:Country)
    WHERE r.number > 0 AND r.round <> 'Qualifier'
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
      r,
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
      r,
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
      CASE
        WHEN ws.serve1 IS NULL THEN false
        ELSE true
      END AS stats
    WITH
      r,
      m,
      ls,
      winners,
      losers,
      u,
      winner_sets,
      loser_sets,
      stats,
      CASE
        WHEN r:Singles THEN 'Singles'
        ELSE 'Doubles'
      END AS matchType,
      [x IN labels(r) WHERE x IN ['ATP', 'Women', 'Men', 'WTA']][0] AS tour,
      CASE
        WHEN
          coalesce(min_winner_rank, 1e9) < coalesce(min_loser_rank, 1e9)
          THEN coalesce(min_winner_rank, 1e9)
        ELSE coalesce(min_loser_rank, 1e9)
      END AS sort_rank
    ORDER BY r.number, sort_rank, m.number
    RETURN
      apoc.map.merge(
        properties(m),
        {
          tour: tour,
          type: matchType,
          round: r.round,
          umpire: u.id,
          stats: stats,
          sets: [
            [x IN winner_sets WHERE x[0] IS NOT NULL],
            [x IN loser_sets WHERE x[0] IS NOT NULL]
          ],
          winners: {players: winners},
          losers: {players: losers},
          incomplete: ls.incomplete
        }
      ) AS match
    `,
    { id: Number(id) }
  )

  const matches = records.map(record => {
    const match = record.get("match")

    match.match_no = match.match_no.toInt()

    if (match.date) {
      match.date = {
        year: match.date.year.toInt(),
        month: match.date.month.toInt(),
        day: match.date.day.toInt()
      }
    }

    if (match.duration) {
      const allSeconds = match.duration.seconds.toInt()
      const allMinutes = Math.floor(allSeconds / 60)
      const hours = Math.floor(allMinutes / 60)

      match.duration = {
        hours,
        minutes: allMinutes % 60,
        seconds: allSeconds % 60
      }
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

    for (let i = 0; i < 2; i++) {
      for (let index = 0; index < match.sets[i].length; index++) {
        match.sets[i][index] = match.sets[i][index].map((item: any) => (item ? item.toInt() : null))
      }
    }

    return match
  })

  return matches
})
