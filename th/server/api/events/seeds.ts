export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH
        (t:Tournament)<-[:EDITION_OF]-
        (e:Event {id: $id})<-[v:SEEDED|Q_SEEDED]-
        (f:Entry)<-[:ENTERED]-
        (p:Player)
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
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(n:Country)
        RETURN
          CASE
            WHEN
              x IS NOT NULL AND
              (x.start_date <= e.start_date OR (p:ATP AND (x.start_date <= e.atp_start_date OR x.start_date <= e.men_start_date)) OR (p:WTA AND (x.start_date <= e.wta_start_date OR x.start_date <= e.women_start_date))) AND
              x.end_date > e.start_date
              THEN apoc.any.properties(n)
            ELSE apoc.any.properties(c)
          END AS country
      }
      WITH
        withdrew,
        country,
        apoc.any.properties(p) AS player,
        apoc.any.properties(f) AS entry,
        CASE
          WHEN p:WTA THEN 'WTA'
          ELSE 'ATP'
        END AS tour,
        t.name AS tournament,
        CASE
          WHEN v:SEEDED THEN 'Main'
          ELSE 'Qualifying'
        END AS drawType,
        v.rank AS rank2,
        CASE
          WHEN f:Singles THEN 'Singles'
          ELSE 'Doubles'
        END AS type
      RETURN DISTINCT
        CASE
          WHEN player IS NULL THEN null
          ELSE
            apoc.map.mergeList(
              [
                entry,
                player,
                {
                  withdrew: withdrew,
                  country: country,
                  tour: tour,
                  tournament: tournament,
                  draw: drawType,
                  rank2: rank2,
                  type: type
                }
              ]
            )
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

  // Turn singles players into single-player teams
  const singlesSeeds = seeds
    .filter((s: any) => s.type === "Singles")
    .map((s: any) => {
      return {
        seed: s.seed ?? s.q_seed,
        draw: s.draw,
        rank2: s.rank2,
        withdrew: s.withdrew,
        tour: s.tour,
        type: s.type,
        team: [
          {
            id: s.id,
            first_name: s.first_name,
            last_name: s.last_name,
            country: s.country,
            rank: s.rank
          }
        ]
      }
    })

  // Find doubles teams
  const doublesPlayers = seeds.filter((s: any) => s.type === "Doubles")
  const usedSeeds = new Set<string>()
  const teams: any[] = []
  for (const player of doublesPlayers) {
    if (usedSeeds.has(`${player.tour}-${player.draw}-${player.seed}`)) continue
    const partner = doublesPlayers.find((p: any) => p.seed === player.seed && p.tour === player.tour && p.draw === player.draw && p.id !== player.id)

    if (partner) {
      teams.push({
        seed: player.seed,
        draw: player.draw,
        rank2: player.rank2,
        withdrew: player.withdrew,
        tour: player.tour,
        type: player.type,
        team: [
          {
            id: player.id,
            first_name: player.first_name,
            last_name: player.last_name,
            country: player.country,
            rank: player.rank
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
      usedSeeds.add(`${player.tour}-${player.draw}-${player.seed}`)
    }
  }

  return {
    tournament: records[0]?.get("player")?.tournament,
    seeds: [...singlesSeeds, ...teams].sort((a, b) => a.seed - b.seed)
  }
})
