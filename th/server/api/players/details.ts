export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(t:Year)
      OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
      CALL (p) {
        OPTIONAL MATCH (p)-[z:REPRESENTED]->(fc:Country)
        WITH
          CASE
            WHEN fc IS NULL THEN null
            ELSE apoc.map.merge(properties(fc), properties(z))
          END AS country
        RETURN COLLECT(DISTINCT country) AS countries
      }
      CALL (p) {
        OPTIONAL MATCH (p)<-[x:COACHES]-(z:Coach)
        WITH
          CASE
            WHEN z IS NULL THEN null
            ELSE
              apoc.map.merge(
                properties(z),
                properties(x)
              )
          END AS coach
        RETURN COLLECT(DISTINCT coach) AS coaches
      }
      CALL (p) {
        OPTIONAL MATCH (p)<-[x:COACHED]-(z:Coach)
        WITH
          CASE
            WHEN z IS NULL THEN null
            ELSE
              apoc.map.merge(
                properties(z),
                properties(x)
              )
          END AS coach
        RETURN COLLECT(DISTINCT coach) AS coached
      }
      RETURN
        apoc.map.clean(
          apoc.map.merge(
            properties(p),
            {
              coaches: coaches,
              former_coaches: coached,
              countries: countries,
              turned_pro: t.id,
              retired: r.id,
              age:
                CASE
                  WHEN
                    p.dod IS NOT NULL AND p.dob IS NOT NULL
                    THEN duration.between(p.dob, p.dod).years
                  WHEN p.dob IS NOT NULL THEN duration.between(p.dob, date()).years
                  ELSE null
                END
            }
          ),
          [],
          [null, {}]
        ) AS player
    `,
    { id }
  )

  const { records: wlRecords } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (p:Player {id: $id})
    OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (s:Score)-[:SCORED]->
      (m:Match)-[:PLAYED]->
      (r:Round)-[:ROUND_OF]->
      (e:Event)
    WITH DISTINCT
      *,
      s:Winner AS isWinner,
      s:Loser AS isLoser,
      m:Singles AS isSingles,
      (m:Best3 OR m:Best5) AS isMatch,
      m:Main AS isMain,
      m:Qualifying AS isQualifying,
      (e:Men OR e:Women) AS isITF,
      r.round = 'Final' AS isFinal,
      ((e.atp_category IN $challenger AND m:ATP) OR
        (e.wta_category IN $challenger AND m:WTA)) AS isChallenger,
      (e.category IS NULL) AND
      (NOT m:ATP OR e.atp_category IS NULL OR NOT e.atp_category IN $challenger) AND
      (NOT m:WTA OR e.wta_category IS NULL OR NOT e.wta_category IN $challenger) AS isTour
    WITH
      *,
      [
        {event_level: 'itf', level: isITF},
        {event_level: 'challenger', level: isChallenger},
        {event_level: 'tour', level: isTour}
      ] AS levels,
      [
        {match_type: 'singles', type: isSingles},
        {match_type: 'doubles', type: NOT isSingles}
      ] AS matchTypes,
      [
        {metric: 'wins', condition: isWinner AND isMatch AND isMain},
        {metric: 'losses', condition: isLoser AND isMatch AND isMain},
        {metric: 'titles', condition: isWinner AND isFinal},
        {metric: 'q_wins', condition: isWinner AND isMatch AND isQualifying},
        {metric: 'q_losses', condition: isLoser AND isMatch AND isQualifying}
      ] AS metrics
    UNWIND levels AS level
    UNWIND matchTypes AS matchType
    UNWIND metrics AS metric
    RETURN
      SUM(
        CASE
          WHEN metric.condition AND level.level AND matchType.type THEN 1
          ELSE 0
        END
      ) AS total,
      level.event_level || '_' || matchType.match_type || '_' || metric.metric AS label
    `,
    { id, challenger: CHALLENGER_CATEGORIES }
  )

  const { records: h2hRecords } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Singles)<-[:SCORED]-(:Score)<-[:SCORED]-(:Entry)<-[:ENTERED]-(opponent:Player) WHERE p.id <> opponent.id
      OPTIONAL MATCH (opponent)-[:REPRESENTS]->(c:Country)
      WITH apoc.map.merge(apoc.any.properties(opponent), {country: apoc.any.properties(c)}) AS opponent, count(m) AS matches, SUM(CASE WHEN s:Winner THEN 1 ELSE 0 END) AS wins
      ORDER BY matches DESC
      LIMIT 10
      RETURN opponent, matches, wins
          `,
    { id }
  )

  const numberKeys = [
    "age",
    "current_doubles",
    "no1_weeks",
    "ch_singles",
    "ye_no1",
    "no1_consecutive",
    "ch_doubles",
    "current_singles",
    "pm",
    "height",
    "hof",
    "matches",
    "wins",
    "turned_pro",
    "retired"
  ]

  const dateKeys = ["singles_ch_date", "dob", "doubles_ch_date", "dod", "start_date", "end_date"]

  const player = records[0].get("player")
  for (const key of numberKeys) {
    if (player[key]) player[key] = player[key].toInt()
  }
  for (const key of dateKeys) {
    if (player[key])
      player[key] = {
        year: player[key].year?.toInt(),
        month: player[key].month?.toInt(),
        day: player[key].day?.toInt()
      }
    if (player["countries"]) {
      player["countries"] = player["countries"].map((country: any) => {
        if (country[key]) {
          country[key] = {
            year: country[key].year?.toInt(),
            month: country[key].month?.toInt(),
            day: country[key].day?.toInt()
          }
        }
        return country
      })
    }
  }

  const coaches = []
  const usedCoaches = new Set<string>()

  for (const coach of player["coaches"]) {
    if (usedCoaches.has(coach.id)) continue

    const sameCoaches = [
      ...player["coaches"].filter((c: any) => c.id === coach.id),
      ...(player["former_coaches"]?.length ? player["former_coaches"].filter((c: any) => c.id === coach.id) : [])
    ]

    const dates = sameCoaches.map((c: any) => {
      if (c.start_date && c.end_date) {
        return `${c.start_date.year.toInt()}-${c.end_date.year.toInt()}`
      } else if (c.start_date) {
        return `${c.start_date.year.toInt()}-present`
      } else {
        if (player["coaches"].find((c: any) => c.id === coach.id)) {
          return "Current"
        } else {
          return "Former"
        }
      }
    })

    coaches.push({
      id: coach.id,
      first_name: coach.first_name,
      last_name: coach.last_name,
      dates
    })

    usedCoaches.add(coach.id)
  }

  for (const coach of player["former_coaches"]) {
    if (usedCoaches.has(coach.id)) continue

    const sameCoaches = [
      ...player["coaches"].filter((c: any) => c.id === coach.id),
      ...player["former_coaches"].filter((c: any) => c.id === coach.id)
    ]

    const dates = sameCoaches.map((c: any) => {
      if (c.start_date && c.end_date) {
        return `${c.start_date.year.toInt()}-${c.end_date.year.toInt()}`
      } else if (c.start_date) {
        return `${c.start_date.year.toInt()}-present`
      } else {
        if (player["coaches"].find((c: any) => c.id === coach.id)) {
          return "Current"
        } else {
          return "Former"
        }
      }
    })

    coaches.push({
      id: coach.id,
      first_name: coach.first_name,
      last_name: coach.last_name,
      dates
    })

    usedCoaches.add(coach.id)
  }

  player["coaches"] = coaches
  delete player["former_coaches"]

  const tours = ["Tour", "Challenger", "ITF"]
  const wl = []
  const titles: { level: string; singles: number; doubles: number }[] = []

  const wlResults = wlRecords.map(record => record.toObject())
  for (const record of wlResults) {
    record["total"] = record["total"]?.toInt()
  }

  for (const tour of tours) {
    const tourResults = wlResults.filter(record => record.label.startsWith(tour.toLowerCase()))
    wl.push({
      level: tour,
      singles: {
        wins: tourResults.find(record => record.label.endsWith("singles_wins"))!.total,
        losses: tourResults.find(record => record.label.endsWith("singles_losses"))!.total,
        q_wins: tourResults.find(record => record.label.endsWith("singles_q_wins"))!.total,
        q_losses: tourResults.find(record => record.label.endsWith("singles_q_losses"))!.total
      },
      doubles: {
        wins: tourResults.find(record => record.label.endsWith("doubles_wins"))!.total,
        losses: tourResults.find(record => record.label.endsWith("doubles_losses"))!.total,
        q_wins: tourResults.find(record => record.label.endsWith("doubles_q_wins"))!.total,
        q_losses: tourResults.find(record => record.label.endsWith("doubles_q_losses"))!.total
      }
    })
    titles.push({
      level: tour,
      singles: tourResults.find(record => record.label.endsWith("singles_titles"))!.total ?? 0,
      doubles: tourResults.find(record => record.label.endsWith("doubles_titles"))!.total ?? 0
    })
  }

  wl.push({
    level: "Total",
    singles: {
      wins: wl.reduce((acc, record) => {
        acc += record.singles.wins ?? 0
        return acc
      }, 0),
      losses: wl.reduce((acc, record) => {
        acc += record.singles.losses ?? 0
        return acc
      }, 0),
      q_wins: wl.reduce((acc, record) => {
        acc += record.singles.q_wins ?? 0
        return acc
      }, 0),
      q_losses: wl.reduce((acc, record) => {
        acc += record.singles.q_losses ?? 0
        return acc
      }, 0)
    },
    doubles: {
      wins: wl.reduce((acc, record) => {
        acc += record.doubles.wins ?? 0
        return acc
      }, 0),
      losses: wl.reduce((acc, record) => {
        acc += record.doubles.losses ?? 0
        return acc
      }, 0),
      q_wins: wl.reduce((acc, record) => {
        acc += record.doubles.q_wins ?? 0
        return acc
      }, 0),
      q_losses: wl.reduce((acc, record) => {
        acc += record.doubles.q_losses ?? 0
        return acc
      }, 0)
    }
  })

  titles.push({
    level: "Total",
    singles: titles.reduce((acc, record) => {
      acc += record.singles ?? 0
      return acc
    }, 0),
    doubles: titles.reduce((acc, record) => {
      acc += record.doubles ?? 0
      return acc
    }, 0)
  })

  const h2hResults = h2hRecords.map(record => record.toObject())
  for (const record of h2hResults) {
    for (const key of numberKeys) {
      if (record[key]) record[key] = record[key].toInt()
    }
  }

  return {
    ...player,
    wl,
    h2h: h2hResults,
    titles
  }
})
