export default defineEventHandler(async query => {
  const { id, mid } = getQuery<{ id: string; mid: string }>(query)

  const matchParams = destructureMid(mid)
  const params = {
    ...matchParams,
    id: Number(id)
  }

  // Update for men / women

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
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(c1:Country)
        WITH
          CASE
            WHEN
              c1 IS NOT NULL AND
              x.start_date <= e.start_date AND
              x.end_date > e.start_date
              THEN apoc.any.properties(c1)
            ELSE apoc.any.properties(c)
          END AS country,
          p,
          f
        WITH
          apoc.map.mergeList(
            [apoc.any.properties(p), apoc.any.properties(f), {country: country}]
          ) AS player
        RETURN COLLECT(DISTINCT player) AS p1
      }
      CALL (s2, e) {
        MATCH (p:Player)-[:ENTERED]->(f:Entry)-[:SCORED]->(s2)
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(c1:Country)
        WITH
          CASE
            WHEN
              c1 IS NOT NULL AND
              x.start_date <= e.start_date AND
              x.end_date > e.start_date
              THEN apoc.any.properties(c1)
            ELSE apoc.any.properties(c)
          END AS country,
          p,
          f
        WITH
          apoc.map.mergeList(
            [apoc.any.properties(p), apoc.any.properties(f), {country: country}]
          ) AS player
        RETURN COLLECT(DISTINCT player) AS p2
      }
      WITH
        p1,
        p2,
        t.name AS tournament,
        CASE
          WHEN surface1 IS NOT NULL THEN apoc.any.properties(surface1)
          ELSE apoc.any.properties(surface2)
        END AS surface,
        CASE
          WHEN e.start_date IS NOT NULL THEN e.start_date
          WHEN m:WTA THEN e.wta_start_date
          ELSE e.atp_start_date
        END AS start_date,
        CASE
          WHEN e.end_date IS NOT NULL THEN e.end_date
          WHEN m:WTA THEN e.wta_end_date
          ELSE e.atp_end_date
        END AS end_date,
        apoc.any.properties(m) AS matchProperties,
        u.id AS umpire,
        r.round AS round,
        s1,
        s2,
        CASE
          WHEN s1:Winner THEN true
          ELSE false
        END AS p1Winner
      WITH
        tournament,
        surface,
        start_date,
        end_date,
        apoc.map.merge(
          matchProperties,
          {
            umpire: umpire,
            round: round,
            p1: p1,
            p2: p2,
            sets:
              [
                [
                  [s1.s1, s1.t1],
                  [s1.s2, s1.t2],
                  [s1.s3, s1.t3],
                  [s1.s4, s1.t4],
                  [s1.s5, s1.t5]
                ],
                [
                  [s2.s1, s2.t1],
                  [s2.s2, s2.t2],
                  [s2.s3, s2.t3],
                  [s2.s4, s2.t4],
                  [s2.s5, s2.t5]
                ]
              ],
            player_incomplete: [s1.incomplete, s2.incomplete],
            p1_winner: p1Winner,
            aces: [s1.aces, s2.aces],
            dfs: [s1.dfs, s2.dfs],
            serve1: [s1.serve1_w, s1.serve1, s2.serve1_w, s2.serve1],
            serve2: [s1.serve2_w, s1.serve2, s2.serve2_w, s2.serve2],
            bps_saved: [s1.bps_saved, s1.bps_faced, s2.bps_saved, s2.bps_faced],
            serve_games: [s1.serve_games, s2.serve_games],
            return_games: [s1.return_games, s2.return_games],
            ret1: [s1.ret1_w, s1.ret1, s2.ret1_w, s2.ret1],
            ret2: [s1.ret2_w, s1.ret2, s2.ret2_w, s2.ret2],
            bps_converted:
              [s1.bps_converted, s1.bp_opps, s2.bps_converted, s2.bp_opps],
            winners: [s1.winners, s2.winners],
            ues: [s1.ues, s2.ues],
            net: [s1.net_w, s1.net, s2.net_w, s2.net],
            max_speed: [s1.max_speed, s2.max_speed],
            avg1_speed: [s1.avg1_speed, s2.avg1_speed],
            avg2_speed: [s1.avg2_speed, s2.avg2_speed]
          }
        ) AS match
      RETURN DISTINCT
        {
          surface: surface,
          start_date: start_date,
          end_date: end_date,
          match: match,
          tournament: tournament
        } AS match
    `,
    params
  )

  const match = records[0].get("match")

  const numberArrayKeys = [
    "aces",
    "dfs",
    "serve1",
    "serve2",
    "bps_saved",
    "ret1",
    "ret2",
    "bps_converted",
    "winners",
    "ues",
    "net",
    "max_speed",
    "avg1_speed",
    "avg2_speed",
    "serve_games",
    "return_games"
  ]

  const players = ["p1", "p2"]
  const numberKeys = ["seed", "rank", "q_seed"]
  const dateKeys = ["start_date", "end_date"]

  // Convert Integer objects to numbers
  for (const key of numberArrayKeys) {
    // Delete keys with null values in the array
    if (match.match[key].some((item: any) => item === null)) {
      delete match.match[key]
    } else {
      match.match[key] = (match.match[key] as any[]).map(item => item.toInt())
    }
  }

  for (const playerKey of players) {
    for (const key of numberKeys) {
      match.match[playerKey].forEach((player: any) => {
        if (player[key]) {
          player[key] = player[key].toInt()
        }
      })
    }
  }

  for (let i = 0; i < 2; i++) {
    for (let index = 4; index >= 0; index--) {
      // Delete keys with null values in the array
      if (match.match.sets[i][index][0] === null) {
        match.match.sets[i].splice(index, 1)
      } else {
        match.match.sets[i][index] = match.match.sets[i][index].map((item: any) => (item ? item.toInt() : null))
      }
    }
  }

  // Convert date objects to {year, month, day}
  for (const key of dateKeys) {
    match[key] = {
      year: match[key].year.toInt(),
      month: match[key].month.toInt(),
      day: match[key].day.toInt()
    }
  }

  if (match.match.date) {
    match.match.date = {
      year: match.match.date.year.toInt(),
      month: match.match.date.month.toInt(),
      day: match.match.date.day.toInt()
    }
  }

  // Convert duration object to number (in minutes)
  if (match.match.duration) {
    const { seconds } = match.match.duration
    match.match.duration = convertDuration(seconds.toInt())
  }

  const { serve1, serve2, ret1, ret2 } = match.match
  match.match["first_serve"] = [serve1[1], serve2[1] + serve1[1], serve1[3], serve1[3] + serve2[3]]
  match.match["serve_w"] = [serve1[0] + serve2[0], serve1[1] + serve2[1], serve1[2] + serve2[2], serve1[3] + serve2[3]]
  match.match["ret_w"] = [ret1[0] + ret2[0], ret1[1] + ret2[1], ret1[2] + ret2[2], ret1[3] + ret2[3]]
  match.match["total_points"] = [
    match.match.serve_w[0] + match.match.ret_w[0],
    match.match.serve_w[1] + match.match.ret_w[1],
    match.match.serve_w[2] + match.match.ret_w[2],
    match.match.serve_w[3] + match.match.ret_w[3]
  ]

  return match
})
