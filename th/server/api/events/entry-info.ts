export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const relationships = [
    "LUCKY_LOSER",
    "ALTERNATE",
    "DEFAULTED",
    "QUALIFIED",
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
      CYPHER 25
      WITH ['Q_LDA', 'Q_WILD_CARD', 'Q_WITHDREW', 'Q_ALTERNATE'] AS quals
      UNWIND $relationships AS relationship
      MATCH (e:Event {id: $id})
      OPTIONAL MATCH
        (c:Country)<-[:REPRESENTS]-(p:Player)-[:ENTERED]->(f:Entry)-[t]->(e)
      WHERE TYPE(t) = relationship
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
        (c1:Country)
      OPTIONAL MATCH
        (f)-[:SCORED]->(s:Score)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p1:Player)
      WHERE p.id <> p1.id
      CALL (*) {
        WHEN relationship IN quals THEN
          RETURN 'Qualifying' AS draw
        WHEN relationship = 'RETIRED' THEN {
          MATCH (f)-[:SCORED]->(s:Score {incomplete: 'R'})
          RETURN
            CASE
              WHEN s:Qualifying THEN 'Qualifying'
              ELSE 'Main'
            END AS draw }
        WHEN relationship = 'WALKOVER' THEN {
          MATCH (f)-[:SCORED]->(s:Score {incomplete: 'WO'})
          RETURN
            CASE
              WHEN s:Qualifying THEN 'Qualifying'
              ELSE 'Main'
            END AS draw }
        ELSE
          RETURN 'Main' AS draw
      }
      WITH
        draw,
        apoc.map.submap(p, ['id', 'first_name', 'last_name']) AS player,
        TYPE(t) AS label,
        [x IN labels(p) WHERE x IN ['ATP', 'WTA']][0] AS tour,
        properties(t) AS properties,
        CASE
          WHEN z IS NULL THEN properties(c)
          ELSE properties(c1)
        END AS country,
        [x IN labels(f) WHERE x <> 'Entry'][0] AS type,
        f.status AS status,
        CASE
          WHEN f.team_mate IS NULL THEN p1.id
          ELSE f.team_mate
        END AS team_mate
      RETURN
        CASE
          WHEN player IS NULL THEN null
          ELSE
            apoc.map.mergeList([
              player,
              {
                tour: tour,
                type: type,
                country: country,
                status: status,
                team_mate: team_mate,
                draw: draw,
                label: label
              },
              properties
            ])
        END AS player
    `,
    { id: Number(id), relationships }
  )

  const teams = []
  const usedIds = new Set<string>()

  const getRelationship = (type: string) => {
    switch (type) {
      case "LUCKY_LOSER":
        return "Lucky Loser"
      case "ALTERNATE":
      case "Q_ALTERNATE":
        return "Alternate"
      case "DEFAULTED":
        return "Default"
      case "QUALIFIED":
        return "Qualifier"
      case "LDA":
      case "Q_LDA":
        return "Last Direct Acceptance"
      case "WILD_CARD":
      case "Q_WILD_CARD":
        return "Wild Card"
      case "WITHDREW":
      case "Q_WITHDREW":
        return "Withdrawal"
      case "RETIRED":
        return "Retirement"
      default:
        return "Walkover"
    }
  }

  for (const record of records) {
    const result = record.get("player")
    if (!result) continue
    if (result.type === "Singles") {
      teams.push({
        label: getRelationship(result.label),
        tour: result.tour,
        type: result.type,
        status: result.status,
        rank: result.rank?.toInt(),
        draw: result.draw,
        team: [
          {
            first_name: result.first_name,
            last_name: result.last_name,
            id: result.id,
            country: result.country,
            reason: result.reason
          }
        ]
      })
    } else {
      if (usedIds.has(result.id) || result.reason === "teammate") continue

      const partner = records.find((p: any) => {
        const player = p.get("player")
        if (!player) return false
        return player.type === "Doubles" && (player.id === result.team_mate || player.team_mate === result.id)
      })

      if (partner) {
        teams.push({
          label: getRelationship(result.label),
          tour: result.tour,
          type: result.type,
          status: result.status,
          team_reason: result.reason,
          rank: result.rank?.toInt(),
          draw: result.draw,
          team: [
            {
              first_name: result.first_name,
              last_name: result.last_name,
              id: result.id,
              country: result.country,
              reason: result.reason
            },
            {
              first_name: partner.get("player").first_name,
              last_name: partner.get("player").last_name,
              id: partner.get("player").id,
              country: partner.get("player").country,
              reason: partner.get("player").reason
            }
          ]
        })
        usedIds.add(result.id)
        usedIds.add(partner.get("player").id)
      }
    }
  }

  return teams
})
