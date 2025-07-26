export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const relationships = [
    "LUCKY_LOSER",
    "ALTERNATE",
    "DEFAULTED",
    "QUALIFIER",
    "LDA",
    "WILD_CARD",
    "WITHDREW",
    "RETIRED",
    "WALKOVER",
    "Q_LDA",
    "Q_WILD_CARD",
    "Q_WITHDREW",
    "Q_ALTERNATE"
  ]

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      WITH ['Q_LDA', 'Q_WILD_CARD', 'Q_WITHDREW', 'Q_ALTERNATE'] AS quals
      UNWIND $relationships AS relationship
      MATCH (e:Event {id: $id})
      OPTIONAL MATCH
        (c:Country)<-[:REPRESENTS]-(p:Player)-[:ENTERED]->(f:Entry)-[t]->(e)
      WHERE TYPE(t) = relationship
      OPTIONAL MATCH (p)-[z:REPRESENTED]->(c1:Country)
      OPTIONAL MATCH
        (f)-[:SCORED]->(:Score)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p1:Player)
      WHERE p.id <> p1.id
      WITH
        CASE WHEN relationship IN quals THEN 'Qualifying' ELSE 'Main' END AS draw,
        apoc.any.properties(p) AS player,
        TYPE(t) AS label,
        [x IN labels(p) WHERE x IN ['ATP', 'WTA']] AS tour,
        apoc.any.properties(t) AS properties,
        CASE
          WHEN
            c1 IS NOT NULL AND
            z.start_date <= e.start_date AND
            z.end_date > e.start_date
            THEN apoc.any.properties(c1)
          ELSE apoc.any.properties(c)
        END AS country,
        [x IN labels(f) WHERE x <> 'Entry'] AS type,
        f.status AS status,
        CASE WHEN f.team_mate IS NULL THEN p1.id ELSE f.team_mate END AS team_mate
      WITH
        label,
        CASE
          WHEN player IS NULL THEN null
          ELSE
            apoc.map.mergeList(
              [
                player,
                {
                  tour: tour[0],
                  type: type[0],
                  country: country,
                  status: status,
                  team_mate: team_mate,
                  draw: draw
                },
                properties
              ]
            )
        END AS player
      WITH label, COLLECT(player) AS players
      WHERE label IS NOT NULL
      RETURN {label: label, players: players} AS result
    `,
    { id: Number(id), relationships }
  )

  const mutatedResults = records.map(record => {
    const result = record.get("result")
    // Turn singles players into single-player teams
    const singlesTeams = result.players
      .filter((p: any) => p.type === "Singles")
      .map((p: any) => ({
        tour: p.tour,
        type: p.type,
        status: p.status,
        rank: p.rank?.toInt(),
        draw: p.draw,
        players: [
          {
            first_name: p.first_name,
            last_name: p.last_name,
            id: p.id,
            country: p.country,
            reason: p.reason
          }
        ]
      }))

    // Find doubles teams
    const doublesPlayers = result.players.filter((p: any) => p.type === "Doubles")
    const teams: any[] = []
    const usedIds = new Set<string>()

    for (const player of doublesPlayers) {
      if (usedIds.has(player.id) || player.reason === "teammate") continue
      const partner = doublesPlayers.find((p: any) => p.id === player.team_mate || p.team_mate === player.id)
      if (partner) {
        teams.push({
          tour: player.tour,
          type: player.type,
          status: player.status,
          team_reason: player.team_reason,
          rank: player.rank?.toInt(),
          draw: player.draw,
          players: [
            {
              first_name: player.first_name,
              last_name: player.last_name,
              id: player.id,
              country: player.country,
              reason: player.reason
            },
            {
              first_name: partner.first_name,
              last_name: partner.last_name,
              id: partner.id,
              country: partner.country,
              reason: partner.reason
            }
          ]
        })
        usedIds.add(player.id)
        usedIds.add(partner.id)
      }
    }

    return {
      label: result.label,
      teams: [...singlesTeams, ...teams]
    }
  })

  const consolidationLabels = {
    Q_LDA: "LDA",
    Q_WILD_CARD: "WILD_CARD",
    Q_WITHDREW: "WITHDREW",
    Q_ALTERNATE: "ALTERNATE"
  }

  for (const [key, value] of Object.entries(consolidationLabels)) {
    const result = mutatedResults.find(r => r.label === key)
    const resultIndex = mutatedResults.findIndex(r => r.label === key)

    if (result) {
      if (mutatedResults.find(r => r.label === value)) {
        const target = mutatedResults.findIndex(r => r.label === value)
        if (target === -1) {
          mutatedResults[resultIndex].label = value
        } else {
          mutatedResults[target].teams.push(...result.teams)
          mutatedResults.splice(resultIndex, 1)
        }
      }
    }
  }

  return mutatedResults
})
