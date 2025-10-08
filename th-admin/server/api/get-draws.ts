export default defineEventHandler(async event => {
  const { id, tour, type, draw } = getQuery<{ id: string; tour: string; type: string; draw: string }>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (m:Match:$($tour):$($type):$($draw) WHERE m.id STARTS WITH $id)-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event)
      OPTIONAL MATCH
        (c1:Country)<-[:REPRESENTS]-
        (p1:Player)-[:ENTERED]-
        (f1:Entry)-[:SCORED]-
        (s1:P1|T1)-[:SCORED]->
        (m)
      OPTIONAL MATCH
        (p1)-
          [g1:REPRESENTED WHERE
            (g1.start_date <= e.start_date AND g1.end_date > e.start_date) OR
            ('ATP' IN labels(p1) AND
              g1.start_date <= coalesce(e.atp_start_date, e.men_start_date) AND
              g1.end_date > coalesce(e.atp_start_date, e.men_start_date)) OR
            ('WTA' IN labels(p1) AND
              g1.start_date <= coalesce(e.wta_start_date, e.women_start_date) AND
              g1.end_date > coalesce(e.wta_start_date, e.women_start_date))]->
        (c3:Country)
      OPTIONAL MATCH
        (m)<-[:SCORED]-
        (s2:P2|T2)<-[:SCORED]-
        (f2:Entry)<-[:ENTERED]-
        (p2:Player)-[:REPRESENTS]->
        (c2:Country)
      OPTIONAL MATCH
        (p2)-
          [g2:REPRESENTED WHERE
            (g2.start_date <= e.start_date AND g2.end_date > e.start_date) OR
            ('ATP' IN labels(p2) AND
              g2.start_date <= coalesce(e.atp_start_date, e.men_start_date) AND
              g2.end_date > coalesce(e.atp_start_date, e.men_start_date)) OR
            ('WTA' IN labels(p2) AND
              g2.start_date <= coalesce(e.wta_start_date, e.women_start_date) AND
              g2.end_date > coalesce(e.wta_start_date, e.women_start_date))]->
        (c4:Country)
      WITH *
      ORDER BY r.number DESC, m.match_no
      WITH
        r.round AS round,
        apoc.map.submap(
          m,
          ['match_no', 'incomplete', 'duration', 'date'],
          null,
          false
        ) AS match,
        apoc.map.submap(
          s1,
          ['s1', 's2', 's3', 's4', 's5', 't1', 't2', 't3', 't4', 't5', 'incomplete'],
          null,
          false
        ) AS s1,
        apoc.map.submap(
          s2,
          ['s1', 's2', 's3', 's4', 's5', 't1', 't2', 't3', 't4', 't5', 'incomplete'],
          null,
          false
        ) AS s2,
        apoc.map.submap(f1, ['seed', 'status', 'q_seed', 'q_status'], null, false) AS f1,
        apoc.map.submap(f2, ['seed', 'status', 'q_seed', 'q_status'], null, false) AS f2,
        apoc.map.merge(
          apoc.map.submap(p1, ['id', 'first_name', 'last_name']),
          {country:
              CASE
                WHEN g1 IS NULL THEN properties(c1)
                ELSE properties(c3)
              END}
        ) AS p1,
        apoc.map.merge(
          apoc.map.submap(p2, ['id', 'first_name', 'last_name']),
          {country:
              CASE
                WHEN g2 IS NULL THEN properties(c2)
                ELSE properties(c4)
              END}
        ) AS p2,
        CASE
          WHEN 'Winner' IN labels(s1) THEN 't1'
          ELSE 't2'
        END AS winner
      RETURN
        round,
        apoc.map.clean(match, [], [null]) AS match,
        s1,
        s2,
        f1,
        f2,
        COLLECT(DISTINCT p1) AS t1,
        COLLECT(DISTINCT p2) AS t2,
        winner
    `,
    { id, tour, type, draw }
  )

  const scoreNumbers = ["s1", "s2", "s3", "s4", "s5", "t1", "t2", "t3", "t4", "t5"]
  const statusNumbers = ["seed", "q_seed"]

  const matches = records.map(record => {
    const match = record.toObject()

    for (const key of scoreNumbers) {
      if (match.s1?.[key]) match.s1[key] = match.s1[key].toInt()
      if (match.s2?.[key]) {
        match.s2[key] = match.s2[key].toInt()
      }
    }

    for (const key of statusNumbers) {
      if (match.f1?.[key]) match.f1[key] = match.f1[key].toInt()
      if (match.f2?.[key]) match.f2[key] = match.f2[key].toInt()
    }

    match.match.match_no = match.match.match_no.toInt()

    return match
  })

  return matches
})
