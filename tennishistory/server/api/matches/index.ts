export default defineEventHandler(async query => {
  const { id, mid } = getQuery<{ id: string; mid: string }>(query)

  const matchParams = destructureMid(mid)
  const params = {
    ...matchParams,
    id: Number(id)
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (m:Match:$ ($tour): $ ($draw): $ ($type) {match_no: $match_no})-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event {id: $id})-[:EDITION_OF]->
        (t:Tournament)
      MATCH (s1:P1|T1)-[:SCORED]->(m)<-[:SCORED]-(s2:P2|T2)
      OPTIONAL MATCH (m)<-[:UMPIRED]-(u:Umpire)
      OPTIONAL MATCH (e)-[:ON_SURFACE]->(surface1:Surface)
      OPTIONAL MATCH (m)-[:PLAYED]->(:Tie)-[:ON_SURFACE]->(surface2:Surface)
      CALL (s1, e) {
        MATCH (p:Player)-[:ENTERED]->(f:Entry)-[:SCORED]->(s1)
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH
          (p)-
            [x:REPRESENTED WHERE
              (x.start_date <= e.start_date AND x.end_date > e.start_date) OR
              ('ATP' IN labels(p) AND
                x.start_date <= coalesce(e.atp_start_date, e.men_start_date) AND
                x.end_date > coalesce(e.atp_start_date, e.men_start_date)) OR
              ('WTA' IN labels(p) AND
                x.start_date <= coalesce(e.wta_start_date, e.women_start_date) AND
                x.end_date > coalesce(e.wta_start_date, e.women_start_date))]->
          (c1:Country)
        WITH
          CASE
            WHEN c1 IS NULL THEN properties(c)
            ELSE properties(c1)
          END AS country,
          p,
          f
        WITH
          apoc.map.mergeList([
            properties(f),
            properties(p),
            {country: country}
          ]) AS player
        RETURN COLLECT(DISTINCT player) AS p1
      }
      CALL (s2, e) {
        MATCH (p:Player)-[:ENTERED]->(f:Entry)-[:SCORED]->(s2)
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH
          (p)-
            [x:REPRESENTED WHERE
              (x.start_date <= e.start_date AND x.end_date > e.start_date) OR
              ('ATP' IN labels(p) AND
                x.start_date <= coalesce(e.atp_start_date, e.men_start_date) AND
                x.end_date > coalesce(e.atp_start_date, e.men_start_date)) OR
              ('WTA' IN labels(p) AND
                x.start_date <= coalesce(e.wta_start_date, e.women_start_date) AND
                x.end_date > coalesce(e.wta_start_date, e.women_start_date))]->
          (c1:Country)
        WITH
          CASE
            WHEN c1 IS NULL THEN properties(c)
            ELSE properties(c1)
          END AS country,
          p,
          f
        WITH
          apoc.map.mergeList([
            properties(f),
            properties(p),
            {country: country}
          ]) AS player
        RETURN COLLECT(DISTINCT player) AS p2
      }
      WITH
        CASE
          WHEN surface1 IS NOT NULL THEN properties(surface1)
          ELSE properties(surface2)
        END AS surface,
        CASE
          WHEN e.start_date IS NOT NULL THEN e.start_date
          WHEN m:WTA THEN e.wta_start_date
          WHEN m:Men THEN e.men_start_date
          WHEN m:Women THEN e.women_start_date
          ELSE e.atp_start_date
        END AS start_date,
        CASE
          WHEN e.end_date IS NOT NULL THEN e.end_date
          WHEN m:WTA THEN e.wta_end_date
          WHEN m:Men THEN e.men_end_date
          WHEN m:Women THEN e.women_end_date
          ELSE e.atp_end_date
        END AS end_date,
        m,
        t,
        u.id AS umpire,
        r.round AS round,
        apoc.map.merge(properties(s1), {players: p1}) AS p1,
        apoc.map.merge(properties(s2), {players: p2}) AS p2,
        CASE
          WHEN s1:Winner THEN true
          ELSE false
        END AS p1Winner
      RETURN DISTINCT
        apoc.map.merge(
          properties(m),
          {
            tournament: t.name,
            umpire: umpire,
            round: round,
            p1: p1,
            p2: p2,
            p1_winner: p1Winner,
            surface: surface,
            start_date: start_date,
            end_date: end_date
          }
        ) AS match
    `,
    params
  )

  const match = records[0].get("match")

  const numberKeys = [
    "aces",
    "dfs",
    "serve1_w",
    "serve1",
    "serve2_w",
    "serve2",
    "bps_saved",
    "bps_faced",
    "ret1_w",
    "ret1",
    "ret2_w",
    "ret2",
    "bps_converted",
    "bp_opps",
    "winners",
    "ues",
    "net_w",
    "net",
    "max_speed",
    "avg1_speed",
    "avg2_speed",
    "serve_games",
    "return_games",
    "s1",
    "s2",
    "s3",
    "s4",
    "s5",
    "t1",
    "t2",
    "t3",
    "t4",
    "t5"
  ]

  const players = ["p1", "p2"]
  const entryNumberKeys = ["seed", "rank", "q_seed"]
  const dateKeys = ["start_date", "end_date", "date"]

  for (const playerKey of players) {
    for (const key of numberKeys) {
      if (match[playerKey][key]) {
        match[playerKey][key] = match[playerKey][key].toInt()
      }
    }

    for (const player of match[playerKey].players) {
      for (const entryKey of entryNumberKeys) {
        if (player[entryKey]) {
          player[entryKey] = player[entryKey].toInt()
        }
      }
    }
  }

  // Convert date objects to {year, month, day}
  for (const key of dateKeys) {
    if (match[key]) {
      match[key] = {
        year: match[key].year.toInt(),
        month: match[key].month.toInt(),
        day: match[key].day.toInt()
      }
    }
  }

  // Convert duration object to number (in minutes)
  if (match.duration) {
    const { seconds } = match.duration
    match.duration = convertDuration(seconds.toInt())
  }

  const stats = []

  for (const stat of MATCH_STATS) {
    if (stat.key || ["Service games won", "Return games won"].includes(stat.label)) {
      const p1 = stat.key ? match.p1[stat.key] : match.p1[stat.denominators![0]]
      const p2 = stat.key ? match.p2[stat.key] : match.p2[stat.denominators![0]]
      if (p1 !== undefined && p2 !== undefined) {
        stats.push({
          label: stat.label.replace(" won", ""),
          category: stat.category,
          low: stat.low,
          percent: false,
          p1,
          p2,
          p1_pc: p1 + p2 === 0 ? 0 : percentage(p1, p1 + p2),
          p2_pc: p1 + p2 === 0 ? 0 : percentage(p2, p1 + p2)
        })
      }
    } else {
      const p1Numerator = stat.numerators!.reduce((acc, key) => acc + (match.p1[key] ?? 0), 0)
      const p1Denominator = stat.denominators!.reduce((acc, key) => acc + (match.p1[key] ?? 0), 0)
      const p2Numerator = stat.numerators!.reduce((acc, key) => acc + (match.p2[key] ?? 0), 0)
      const p2Denominator = stat.denominators!.reduce((acc, key) => acc + (match.p2[key] ?? 0), 0)

      stats.push({
        ...stat,
        p1: `${p1Numerator}/${p1Denominator}`,
        p2: `${p2Numerator}/${p2Denominator}`,
        p1_pc: p1Denominator === 0 ? 0 : percentage(p1Numerator, p1Denominator),
        p2_pc: p2Denominator === 0 ? 0 : percentage(p2Numerator, p2Denominator)
      })
    }
  }

  const { surface, court, round, date, end_date, duration, match_no, umpire, p1_winner, start_date, p1, p2, chart_link, tournament } = match

  const p1Sets = []
  const p2Sets = []

  const sets = ["1", "2", "3", "4", "5"]

  for (const set of sets) {
    if (match.p1[`s${set}`] && match.p2[`s${set}`]) {
      p1Sets.push([match.p1[`s${set}`], match.p1[`t${set}`]])
      p2Sets.push([match.p2[`s${set}`], match.p2[`t${set}`]])
    }
  }

  return {
    tournament,
    chart_link,
    surface,
    court,
    round,
    date,
    end_date,
    duration,
    match_no: match_no.toInt(),
    umpire,
    p1_winner,
    start_date,
    match_stats: stats,
    sets: [p1Sets, p2Sets],
    p1: p1.players,
    p2: p2.players,
    p1_incomplete: p1.incomplete,
    p2_incomplete: p2.incomplete
  }
})
