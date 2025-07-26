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
            ELSE apoc.map.merge(apoc.any.properties(fc), apoc.any.properties(z))
          END AS country
        RETURN COLLECT(DISTINCT country) AS countries
      }
      CALL (p) {
        OPTIONAL MATCH (p)<-[x:COACHES]-(z:Coach)
        WITH
          CASE
            WHEN z IS NULL THEN null
            ELSE
              apoc.map.mergeList(
                [
                  apoc.any.properties(z),
                  apoc.any.properties(x)
                ]
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
              apoc.map.mergeList(
                [
                  apoc.any.properties(z),
                  apoc.any.properties(x)
                ]
              )
          END AS coach
        RETURN COLLECT(DISTINCT coach) AS coached
      }
      RETURN
        apoc.map.clean(
          apoc.map.merge(
            apoc.any.properties(p),
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

  const { records: titlesRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      OPTIONAL MATCH
        (p)-[:ENTERED]->
        (:Entry)-[:SCORED]->
        (:Winner)-[:SCORED]->
        (s:Singles)-[:PLAYED]->
        (:Round {round: 'Final'})-[:ROUND_OF]->
        (e:Event)
      WITH
        p,
        e,
        COALESCE(
          CASE
            WHEN e.start_date IS NOT NULL THEN e.start_date
            WHEN p:ATP AND e.atp_start_date IS NOT NULL THEN e.atp_start_date
            WHEN p:ATP THEN e.men_start_date
            WHEN p:WTA AND e.wta_start_date IS NOT NULL THEN e.wta_start_date
            WHEN p:WTA THEN e.women_start_date
            ELSE null
          END,
          e.start_date
        ) AS start_singles
      ORDER BY start_singles ASC
      WITH p, collect({e: e, start: start_singles}) AS singles_events

      OPTIONAL MATCH
        (p)-[:ENTERED]->
        (:Entry)-[:SCORED]->
        (:Winner)-[:SCORED]->
        (d:Doubles)-[:PLAYED]->
        (:Round {round: 'Final'})-[:ROUND_OF]->
        (e2:Event)
      WITH
        p,
        singles_events,
        e2,
        COALESCE(
          CASE
            WHEN e2.start_date IS NOT NULL THEN e2.start_date
            WHEN p:ATP AND e2.atp_start_date IS NOT NULL THEN e2.atp_start_date
            WHEN p:ATP THEN e2.men_start_date
            WHEN p:WTA AND e2.wta_start_date IS NOT NULL THEN e2.wta_start_date
            WHEN p:WTA THEN e2.women_start_date
            ELSE null
          END,
          e2.start_date
        ) AS start_doubles
      ORDER BY start_doubles ASC
      WITH singles_events, collect({e: e2, start: start_doubles}) AS doubles_events

      WITH
        singles_events[0] AS first_singles,
        singles_events[-1] AS last_singles,
        doubles_events[0] AS first_doubles,
        doubles_events[-1] AS last_doubles
      WITH
        first_singles,
        last_singles,
        first_doubles,
        last_doubles,
        first_singles.e AS e1,
        last_singles.e AS e2,
        first_doubles.e AS e3,
        last_doubles.e AS e4
      OPTIONAL MATCH (e1)-[:EDITION_OF]->(t1:Tournament)
      OPTIONAL MATCH (e2)-[:EDITION_OF]->(t2:Tournament)
      OPTIONAL MATCH (e3)-[:EDITION_OF]->(t3:Tournament)
      OPTIONAL MATCH (e4)-[:EDITION_OF]->(t4:Tournament)

      WITH
        apoc.map.clean(
          {year: first_singles.start_date.year, id: first_singles.id, tournament: apoc.any.properties(t1)},
          [],
          [null]
        ) AS first_singles,
        apoc.map.clean(
          {year: last_singles.start_date.year, id: last_singles.id, tournament: apoc.any.properties(t2)},
          [],
          [null]
        ) AS last_singles,
        apoc.map.clean(
          {year: first_doubles.start_date.year, id: first_doubles.id, tournament: apoc.any.properties(t3)},
          [],
          [null]
        ) AS first_doubles,
        apoc.map.clean(
          {year: last_doubles.start_date.year, id: last_doubles.id, tournament: apoc.any.properties(t4)},
          [],
          [null]
        ) AS last_doubles
      RETURN
        apoc.map.clean(
          {
            first_singles: first_singles,
            last_singles: last_singles,
            first_doubles: first_doubles,
            last_doubles: last_doubles
          },
          [],
          [{}]
        ) AS titles
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
    if (player["coaches"]) {
      player["coaches"] = player["coaches"].map((coach: any) => {
        if (coach[key]) {
          coach[key] = {
            year: coach[key].year?.toInt(),
            month: coach[key].month?.toInt(),
            day: coach[key].day?.toInt()
          }
        }
        return coach
      })
    }
    if (player["former_coaches"]) {
      player["former_coaches"] = player["former_coaches"].map((coach: any) => {
        if (coach[key]) {
          coach[key] = {
            year: coach[key].year?.toInt(),
            month: coach[key].month?.toInt(),
            day: coach[key].day?.toInt()
          }
        }
        return coach
      })
    }
  }

  const wlResults = wlRecords.map(record => record.toObject())
  for (const record of wlResults) {
    record["total"] = record["total"]?.toInt()
  }

  const h2hResults = h2hRecords.map(record => record.toObject())
  for (const record of h2hResults) {
    for (const key of numberKeys) {
      if (record[key]) record[key] = record[key].toInt()
    }
  }

  const titlesResults = titlesRecords[0].get("titles")
  for (const [key, value] of Object.entries(titlesResults)) {
    if (value) {
      titlesResults[key] = {
        ...value,
        // @ts-ignore
        id: value.id?.toInt(),
        // @ts-ignore
        year: value.year?.toInt(),
        tournament: {
          // @ts-ignore
          ...value.tournament,
          // @ts-ignore
          id: value.tournament.id?.toInt()
        }
      }
    }
  }

  return {
    ...player,
    wl: wlResults,
    h2h: h2hResults,
    ...titlesResults
  }
})
