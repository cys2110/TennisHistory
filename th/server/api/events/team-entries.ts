export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (e:Event {id: toInteger($id)})
      MATCH
        (c:Country)<-[:REPRESENTS]-
        (p:Player)-[:ENTERED]->
        (f:Entry)-[:SCORED]-
        (s:Score)
      WHERE f.id STARTS WITH toString(e.id)
      OPTIONAL MATCH
        (p)-
          [z:REPRESENTED WHERE
            (z.start_date <= e.start_date OR
              ('ATP' IN labels(p) AND
                z.start_date <= coalesce(e.atp_start_date, e.men_start_date)) OR
              ('WTA') IN labels(p) AND
              z.start_date <= coalesce(e.wta_start_date, e.women_start_date)) AND
            (z.end_date > e.start_date OR
              ('ATP' IN labels(p) AND
                z.end_date > coalesce(e.atp_start_date, e.men_start_date) OR
                ('WTA' IN labels(p) AND
                  z.end_date > coalesce(e.wta_start_date, e.women_start_date))))]->
        (o:Country)
      CALL (*) {
        WHEN f:Singles THEN {
          WITH
            apoc.map.submap(f, ['seed', 'q_seed', 'status', 'q_status'], null, false) AS entry,
            CASE
              WHEN s:Main THEN 'Main'
              ELSE 'Qualifying'
            END AS draw,
            apoc.map.merge(
              apoc.map.submap(p, ['id', 'first_name', 'last_name']),
              {
                rank: f.rank,
                country:
                  CASE
                    WHEN z IS NULL THEN properties(c)
                    ELSE properties(o)
                  END
              }
            ) AS player,
            CASE
              WHEN p:ATP THEN 'ATP'
              ELSE 'WTA'
            END AS tour
          RETURN
            apoc.map.clean(
              apoc.map.merge(
                entry,
                {type: 'Singles', draw: draw, players: [player], tour: tour}
              ),
              [],
              [null]
            ) AS team }
        ELSE {
          MATCH
            (s)<-[:SCORED]-
            (f1:Entry)<-[:ENTERED]-
            (p1:Player WHERE p1.id <> p.id)-[:REPRESENTS]->
            (c1:Country)
          OPTIONAL MATCH
            (p1)-
              [z1:REPRESENTED WHERE
                (z1.start_date <= e.start_date OR
                  ('ATP' IN labels(p) AND
                    z1.start_date <= coalesce(e.atp_start_date, e.men_start_date)) OR
                  ('WTA') IN labels(p) AND
                  z1.start_date <= coalesce(e.wta_start_date, e.women_start_date)) AND
                (z1.end_date > e.start_date OR
                  ('ATP' IN labels(p) AND
                    z1.end_date > coalesce(e.atp_start_date, e.men_start_date) OR
                    ('WTA' IN labels(p) AND
                      z1.end_date >
                      coalesce(e.wta_start_date, e.women_start_date))))]->
            (o1:Country)
          WITH
            apoc.map.submap(f, ['seed', 'q_seed', 'status', 'q_status'], null, false) AS entry,
            CASE
              WHEN s:Main THEN 'Main'
              ELSE 'Qualifying'
            END AS draw,
            apoc.map.merge(
              apoc.map.submap(p, ['id', 'first_name', 'last_name']),
              {
                rank: f.rank,
                country:
                  CASE
                    WHEN z IS NULL THEN properties(c)
                    ELSE properties(o)
                  END
              }
            ) AS player1,
            apoc.map.merge(
              apoc.map.submap(p1, ['id', 'first_name', 'last_name']),
              {
                rank: f1.rank,
                country:
                  CASE
                    WHEN z1 IS NULL THEN properties(c1)
                    ELSE properties(o1)
                  END
              }
            ) AS player2,
            CASE
              WHEN p:ATP THEN 'ATP'
              ELSE 'WTA'
            END AS tour
          WITH
            entry,
            draw,
            tour,
            CASE
              WHEN toString(player1.id) < toString(player2.id) THEN [player1, player2]
              ELSE [player2, player1]
            END AS players

          RETURN
            apoc.map.clean(
              apoc.map.merge(
                entry,
                {type: 'Doubles', draw: draw, players: players, tour: tour}
              ),
              [],
              [null]
            ) AS team }
      }
      RETURN DISTINCT team
    `,
    { id }
  )

  const entries = records.map(record => {
    const entry = record.get("team")
    const numberKeys = ["seed", "q_seed"]

    for (const key of numberKeys) {
      if (entry[key]) entry[key] = entry[key].toInt()
    }

    for (const player of entry.players) {
      if (player.rank) player.rank = player.rank.toInt()
    }

    return entry
  })

  return entries
})
