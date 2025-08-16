export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH
        (e:Event {id: $id})<-[v:SEEDED|Q_SEEDED]-(f:Entry)<-[:ENTERED]-(p:Player)
      WITH *
      ORDER BY f.seed, f.q_seed
      CALL (f, e) {
        OPTIONAL MATCH (f)-[u:WITHDREW]->(e)
        RETURN
          CASE
            WHEN u IS NOT NULL THEN true
            ELSE false
          END AS withdrew
      }
      CALL (p, e) {
        MATCH (p)-[:REPRESENTS]->(c:Country)
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
          (n:Country)
        RETURN
          CASE
            WHEN z IS NULL THEN properties(c)
            ELSE properties(n)
          END AS country
      }
      WITH
        withdrew,
        country,
        properties(p) AS player,
        properties(f) AS entry,
        [x IN labels(p) WHERE NOT x IN ['Update', 'Coach', 'Player']][0] AS tour,
        CASE
          WHEN v:SEEDED THEN 'Main'
          ELSE 'Qualifying'
        END AS drawType,
        v.rank AS rank2,
        CASE
          WHEN f:Singles THEN 'Singles'
          ELSE 'Doubles'
        END AS type
      ORDER BY tour, type DESC
      RETURN DISTINCT
        CASE
          WHEN player IS NULL THEN null
          ELSE
            apoc.map.mergeList([
              entry,
              player,
              {
                withdrew: withdrew,
                country: country,
                tour: tour,
                draw: drawType,
                rank2: rank2,
                type: type
              }
            ])
        END AS player
    `,
    { id: Number(id) }
  )

  const seeds = records.map(seed => {
    const numberKeys = ["seed", "rank", "q_seed", "rank2"]
    const player = seed.get("player")

    for (const key of numberKeys) {
      if (player[key]) {
        player[key] = player[key].toInt()
      }
    }

    return player
  })

  const teams: any[] = []
  const usedIds = new Set<string>()

  for (const seed of seeds) {
    if (seed.type === "Singles") {
      teams.push({
        seed: seed.seed ?? seed.q_seed,
        draw: seed.draw,
        rank2: seed.rank2,
        withdrew: seed.withdrew,
        tour: seed.tour,
        type: seed.type,
        team: [
          {
            id: seed.id,
            first_name: seed.first_name,
            last_name: seed.last_name,
            country: seed.country,
            rank: seed.rank
          }
        ]
      })
    } else {
      if (!usedIds.has(seed.id)) {
        const partner = seeds.find(
          (s: any) =>
            s.type === "Doubles" && (seed.seed ? s.seed === seed.seed : seed.q_seed === s.q_seed) && s.tour === seed.tour && s.id !== seed.id
        )

        if (partner) {
          teams.push({
            seed: seed.seed ?? seed.q_seed,
            draw: seed.draw,
            rank2: seed.rank2,
            withdrew: seed.withdrew,
            tour: seed.tour,
            type: seed.type,
            team: [
              {
                id: seed.id,
                first_name: seed.first_name,
                last_name: seed.last_name,
                country: seed.country,
                rank: seed.rank
              },
              {
                id: partner.id,
                first_name: partner.first_name,
                last_name: partner.last_name,
                country: partner.country,
                rank: partner.rank
              }
            ]
          })
          usedIds.add(seed.id)
          usedIds.add(partner.id)
        }
      }
    }
  }

  return teams
})
