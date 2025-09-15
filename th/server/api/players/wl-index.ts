export default defineEventHandler(async query => {
  const { id } = getQuery(query)
  const currentYear = new Date().getFullYear()

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    OPTIONAL MATCH
      (p:Player {id: $id})-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (f:Winner)-[:SCORED]->
      (m:Singles)-[:PLAYED]->
      (r:Round)
    WHERE r.round = 'Final'
    WITH DISTINCT m AS titleMatch
    MATCH
      (p:Player {id: $id})-[:ENTERED]-
      (g1:Entry)-[:SCORED]-
      (f:Score)-[:SCORED]-
      (m:Singles)-[:SCORED]-
      (f2:Score)-[:SCORED]-
      (g2:Entry)-[:ENTERED]-
      (p2:Player)
    MATCH (m)-[:PLAYED]-(r:Round)-[:ROUND_OF]-(e:Event)-[:ON_SURFACE]-(s:Surface)
    MATCH (e)-[:IN_YEAR]->(y:Year)
    WITH
      *,
      ((m:ATP AND e.atp_category IN $challenger) OR
        (m:WTA AND e.wta_category IN $challenger)) AS isChallenger,
      (e.category IS NULL) AND
      (NOT m:ATP OR e.atp_category IS NULL OR NOT e.atp_category IN $challenger) AND
      (NOT m:WTA OR e.wta_category IS NULL OR NOT e.wta_category IN $challenger) AS isNotChallenger,
      m:Best3|Best5 AS wasPlayed,
      (e:Men OR e:Women) AS isITF,
      y.id = $year AS ytd,
      ((f.s1 = 7 AND f2.s1 = 6) OR
        (f.s2 = 7 AND f2.s2 = 6) OR
        (f.s3 = 7 AND f2.s3 = 6) OR
        (f.s4 = 7 AND f2.s4 = 6) OR
        (f.s5 = 7 AND f2.s5 = 6)) AS wonTieBreak,
      ((f.s1 = 6 AND f2.s1 = 7) OR
        (f.s2 = 6 AND f2.s2 = 7) OR
        (f.s3 = 6 AND f2.s3 = 7) OR
        (f.s4 = 6 AND f2.s4 = 7) OR
        (f.s5 = 6 AND f2.s5 = 7)) AS lostTieBreak,
      ((f.s1 = 0 AND f2.s1 = 6) OR
        (f.s2 = 0 AND f2.s2 = 6) OR
        (f.s3 = 0 AND f2.s3 = 6) OR
        (f.s4 = 0 AND f2.s4 = 6) OR
        (f.s5 = 0 AND f2.s5 = 6)) AS wasBagelled,
      ((f.s1 = 6 AND f2.s1 = 0) OR
        (f.s2 = 6 AND f2.s2 = 0) OR
        (f.s3 = 6 AND f2.s3 = 0) OR
        (f.s4 = 6 AND f2.s4 = 0) OR
        (f.s5 = 6 AND f2.s5 = 0)) AS Bagelled,
      ((f.s1 = 1 AND f2.s1 = 6) OR
        (f.s2 = 1 AND f2.s2 = 6) OR
        (f.s3 = 1 AND f2.s3 = 6) OR
        (f.s4 = 1 AND f2.s4 = 6) OR
        (f.s5 = 1 AND f2.s5 = 6)) AS wasBreadsticked,
      ((f.s1 = 6 AND f2.s1 = 1) OR
        (f.s2 = 6 AND f2.s2 = 1) OR
        (f.s3 = 6 AND f2.s3 = 1) OR
        (f.s4 = 6 AND f2.s4 = 1) OR
        (f.s5 = 6 AND f2.s5 = 1)) AS Breadsticked,
      (e.category IN $masters OR
        (m:ATP AND e.atp_category IN $masters) OR
        (m:WTA AND e.wta_category IN $masters)) AS isMasters,
      titleMatch
    WITH
      f,
      m,
      collect(titleMatch) AS titleMatch,
      wasPlayed,
      ytd,
      [
        {draw: 'Main', condition: m:Main},
        {draw: 'Qualifying', condition: m:Qualifying}
      ] AS draws,
      [
        {level: 'Tour', condition: isNotChallenger AND NOT isITF},
        {level: 'Challenger', condition: isChallenger},
        {level: 'ITF', condition: isITF}
      ] AS levels,
      [
        {category: 'Match Record', stat: 'Overall'},
        {
          category: 'Match Record',
          stat: 'Grand Slams',
          condition: e.category = 'Grand Slam'
        },
        {category: 'Match Record', stat: '1000 Level', condition: isMasters},
        {
          category: 'Pressure Points',
          stat: 'Tie Breaks',
          winCondition: wonTieBreak,
          lossCondition: lostTieBreak
        },
        {
          category: 'Pressure Points',
          stat: 'Versus Top 10',
          condition: g2.rank < 11
        },
        {category: 'Pressure Points', stat: 'Finals', condition: r.round = 'Final'},
        {
          category: 'Pressure Points',
          stat: 'Deciding Set',
          condition:
            ((m:Best3 AND f.s3 IS NOT NULL) OR (m:Best5 AND f.s5 IS NOT NULL))
        },
        {
          category: 'Pressure Points',
          stat: '5th Set Record',
          condition: f.s5 IS NOT NULL
        },
        {category: 'Environment', stat: 'Clay', condition: s.surface = 'Clay'},
        {category: 'Environment', stat: 'Grass', condition: s.surface = 'Grass'},
        {category: 'Environment', stat: 'Hard', condition: s.surface = 'Hard'},
        {category: 'Environment', stat: 'Carpet', condition: s.surface = 'Carpet'},
        {
          category: 'Environment',
          stat: 'Indoor',
          condition: s.environment = 'Indoor'
        },
        {
          category: 'Environment',
          stat: 'Outdoor',
          condition: s.environment = 'Outdoor'
        },
        {category: 'Other', stat: 'After Winning 1st Set', condition: f.s1 > f2.s1},
        {category: 'Other', stat: 'After Losing 1st Set', condition: f.s1 < f2.s1},
        {category: 'Other', stat: 'Vs. Right-Handers', condition: p2.rh},
        {category: 'Other', stat: 'Vs. Left-Handers', condition: p2.rh = false},
        {
          category: 'Other',
          stat: 'Bagels',
          winCondition: Bagelled,
          lossCondition: wasBagelled
        },
        {
          category: 'Other',
          stat: 'Breadsticks',
          winCondition: Breadsticked,
          lossCondition: wasBreadsticked
        }
      ] AS categories
    UNWIND draws AS eventDraw
    UNWIND levels AS eventLevel
    UNWIND categories AS eventCategory
    WITH
      eventDraw.draw AS draw,
      eventLevel.level AS level,
      eventCategory.category AS category,
      eventCategory.stat AS stat,
      SUM(
        CASE
          WHEN
            eventDraw.condition AND
            eventLevel.condition AND
            (COALESCE(eventCategory.condition, false) OR
              eventCategory.stat = 'Overall' OR
              (eventCategory.stat IN ['Tie Breaks', 'Bagels', 'Breadsticks'] AND
                eventCategory.winCondition)) AND
            f:Winner AND
            wasPlayed
            THEN 1
          ELSE 0
        END
      ) AS wins,
      SUM(
        CASE
          WHEN
            eventDraw.condition AND
            eventLevel.condition AND
            (COALESCE(eventCategory.condition, false) OR
              eventCategory.stat = 'Overall' OR
              (eventCategory.stat IN ['Tie Breaks', 'Bagels', 'Breadsticks'] AND
                eventCategory.winCondition)) AND
            f:Loser AND
            wasPlayed
            THEN 1
          ELSE 0
        END
      ) AS losses,
      SUM(
        CASE
          WHEN
            eventDraw.draw = 'Main' AND
            eventLevel.condition AND
            eventCategory.category IN ['Match Record', 'Environment'] AND
            (COALESCE(eventCategory.condition, false) OR
              eventCategory.stat = 'Overall') AND
            m IN titleMatch
            THEN 1
          ELSE 0
        END
      ) AS titles,
      SUM(
        CASE
          WHEN
            eventDraw.condition AND
            eventLevel.condition AND
            (COALESCE(eventCategory.condition, false) OR
              eventCategory.stat = 'Overall' OR
              (eventCategory.stat IN ['Tie Breaks', 'Bagels', 'Breadsticks'] AND
                eventCategory.winCondition)) AND
            f:Winner AND
            wasPlayed AND
            ytd
            THEN 1
          ELSE 0
        END
      ) AS ytd_wins,
      SUM(
        CASE
          WHEN
            eventDraw.condition AND
            eventLevel.condition AND
            (COALESCE(eventCategory.condition, false) OR
              eventCategory.stat = 'Overall' OR
              (eventCategory.stat IN ['Tie Breaks', 'Bagels', 'Breadsticks'] AND
                eventCategory.winCondition)) AND
            f:Loser AND
            wasPlayed AND
            ytd
            THEN 1
          ELSE 0
        END
      ) AS ytd_losses,
      SUM(
        CASE
          WHEN
            eventDraw.draw = 'Main' AND
            eventLevel.condition AND
            eventCategory.category IN ['Match Record', 'Environment'] AND
            (COALESCE(eventCategory.condition, false) OR
              eventCategory.stat = 'Overall') AND
            m IN titleMatch AND
            ytd
            THEN 1
          ELSE 0
        END
      ) AS ytd_titles
    RETURN
      {
        draw: draw,
        level: level,
        category: category,
        stat: stat,
        wins: wins,
        losses: losses,
        titles: titles,
        ytd_wins: ytd_wins,
        ytd_losses: ytd_losses,
        ytd_titles: ytd_titles
      } AS index
    `,
    { id, challenger: CHALLENGER_CATEGORIES, masters: MASTERS_CATEGORIES, year: currentYear }
  )

  const player = records.map((record: any) => record.get("index"))

  const index = player.map((statistic: any) => {
    const { wins, losses, titles, ytd_wins, ytd_losses, ytd_titles, ...stat } = statistic
    return {
      ...stat,
      wins: wins?.toInt(),
      losses: losses?.toInt(),
      titles: titles?.toInt(),
      ytd_wins: ytd_wins?.toInt(),
      ytd_losses: ytd_losses?.toInt(),
      ytd_titles: ytd_titles?.toInt()
    }
  })

  for (const statistic of index) {
    if (["Other", "Pressure Points"].includes(statistic.category)) {
      delete statistic.titles
      delete statistic.ytd_titles
    }
    statistic.value = statistic.wins + statistic.losses === 0 ? 0 : statistic.wins / (statistic.wins + statistic.losses)
    statistic.ytd_value = statistic.ytd_wins + statistic.ytd_losses === 0 ? 0 : statistic.ytd_wins / (statistic.ytd_wins + statistic.ytd_losses)
  }

  return index
})
