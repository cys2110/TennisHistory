export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      WITH
        [
          'ATP Masters 1000',
          'ATP Super 9',
          'ATP Masters Series',
          'ATP Championship Series, Single Week',
          'WTA 1000',
          'Premier Mandatory'
        ] AS masters,
        ['ATP Challenger 125', 'WTA 125'] AS challenger
      MATCH
        (p:Player {id: $id})-[:ENTERED]-
        (g1:Entry)-[:SCORED]-
        (f:Score)-[:SCORED]-
        (m:Singles)-[:SCORED]-
        (f2:Score)-[:SCORED]-
        (g2:Entry)-[:ENTERED]-
        (p2:Player)
      MATCH (m)-[:PLAYED]-(r:Round)-[:ROUND_OF]-(e:Event)-[:ON_SURFACE]-(s:Surface)
      WITH
        *,
        (e.category IN challenger OR
          (m:ATP AND e.atp_category IN challenger) OR
          (m:WTA AND e.wta_category IN challenger)) AS isChallenger,
        (e.category IS NULL OR NOT e.category IN challenger) AND
        (NOT m:ATP OR e.atp_category IS NULL OR NOT e.atp_category IN challenger) AND
        (NOT m:WTA OR e.wta_category IS NULL OR NOT e.wta_category IN challenger) AS isNotChallenger,
        m:Main AS isMain,
        m:Qualifying AS isQualifying,
        e:ATP OR e:WTA AS isTour,
        e:ITF AS isITF,
        r.round = 'Final' AS isFinal,
        s.surface = 'Clay' AS isClay,
        s.surface = 'Grass' AS isGrass,
        s.surface = 'Hard' AS isHard,
        s.surface = 'Carpet' AS isCarpet,
        s.environment = 'Indoor' AS isIndoor,
        s.environment = 'Outdoor' AS isOutdoor,
        p2.rh AS opponentIsRH,
        NOT p2.rh AS opponentIsLH,
        e.category = 'Grand Slam' AS isSlam,
        f.s1 > f2.s1 AS wonSet1,
        f.s1 < f2.s1 AS lostSet1,
        ((m:Best3 AND f.s3 IS NOT NULL) OR (m:Best5 AND f.s5 IS NOT NULL)) AS decidingSetPlayed,
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
        (e.category IN masters OR
          (m:ATP AND e.atp_category IN masters) OR
          (m:WTA AND e.wta_category IN masters)) AS isMasters
      RETURN [
        {
          category: 'Match Record',
          stat: 'Overall',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isMain AND isNotChallenger THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isMain AND isNotChallenger THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isFinal AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: 'Overall',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isQualifying AND isNotChallenger THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isQualifying AND isNotChallenger THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: 'Overall',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isMain AND isChallenger THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isMain AND isChallenger THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isFinal AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: 'Overall',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isQualifying AND isChallenger THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isQualifying AND isChallenger THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: 'Overall',
          level: 'ITF',
          type: 'Main',
          wins: SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain THEN 1
                ELSE 0
              END),
          losses: SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: 'Overall',
          level: 'ITF',
          type: 'Qualifying',
          wins: SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying THEN 1
                ELSE 0
              END),
          losses: SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: 'Grand Slams',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isMain AND isSlam THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isMain AND isSlam THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isMain AND isFinal AND isSlam THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: 'Grand Slams',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isQualifying AND isSlam THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isQualifying AND isSlam THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: '1000 Level',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isMain AND isMasters THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isMain AND isMasters THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isMain AND isFinal AND isMasters THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Match Record',
          stat: '1000 Level',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isTour AND isQualifying AND isMasters THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isQualifying AND isMasters THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Tie Breaks',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN isTour AND isMain AND wonTieBreak AND isNotChallenger THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN isTour AND isMain AND lostTieBreak AND isNotChallenger THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Tie Breaks',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  isTour AND isQualifying AND wonTieBreak AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  isTour AND isQualifying AND lostTieBreak AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Tie Breaks',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN isTour AND isMain AND wonTieBreak AND isChallenger THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN isTour AND isMain AND lostTieBreak AND isChallenger THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Tie Breaks',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN isTour AND isQualifying AND wonTieBreak AND isChallenger THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN isTour AND isQualifying AND lostTieBreak AND isChallenger THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Tie Breaks',
          level: 'ITF',
          type: 'Main',
          wins: SUM(
              CASE
                WHEN isITF AND isMain AND wonTieBreak THEN 1
                ELSE 0
              END),
          losses: SUM(
              CASE
                WHEN isITF AND isMain AND lostTieBreak THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isClay AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Tie Breaks',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN isITF AND isQualifying AND wonTieBreak THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN isITF AND isQualifying AND lostTieBreak THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Versus Top 10',
          level: 'Tour',
          type: 'Main',
          wins: SUM(
              CASE
                WHEN f:Winner AND g2.rank < 11 THEN 1
                ELSE 0
              END),
          losses: SUM(
              CASE
                WHEN f:Loser AND g2.rank < 11 THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Finals',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isFinal AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isFinal AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Finals',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isFinal AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isFinal AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Finals',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND isClay THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND isClay THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isClay AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Deciding Set',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  decidingSetPlayed AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isMain AND
                  decidingSetPlayed AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Deciding Set',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  decidingSetPlayed AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  decidingSetPlayed AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Deciding Set',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  decidingSetPlayed AND
                  isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isMain AND
                  decidingSetPlayed AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Deciding Set',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  decidingSetPlayed AND
                  isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  decidingSetPlayed AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Deciding Set',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND isClay THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND isClay THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isClay AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: 'Deciding Set',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND decidingSetPlayed THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND decidingSetPlayed THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Pressure Points',
          stat: '5th Set Record',
          level: 'Tour',
          type: 'Main',
          wins: SUM(
              CASE
                WHEN f:Winner AND f.s5 IS NOT NULL THEN 1
                ELSE 0
              END),
          losses: SUM(
              CASE
                WHEN f:Loser AND f.s5 IS NOT NULL THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Clay',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isClay AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isClay AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isFinal AND
                  isClay AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Clay',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND isClay AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isClay AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Clay',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isClay AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isMain AND isClay AND isChallenger THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isClay AND
                  isFinal AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Clay',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND isClay AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isClay AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Clay',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND isClay THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND isClay THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isClay AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Clay',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND isClay THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND isClay THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Grass',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isGrass AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isGrass AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isGrass AND
                  isFinal AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Grass',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  isGrass AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isGrass AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Grass',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isGrass AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isGrass AND isChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isGrass AND
                  isFinal AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Grass',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND isGrass AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isGrass AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Grass',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND isGrass THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND isGrass THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isGrass AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Grass',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND isGrass THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND isGrass THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Hard',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isHard AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isHard AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isHard AND
                  isFinal AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Hard',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND isHard AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isHard AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Hard',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isHard AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isTour AND isMain AND isHard AND isChallenger THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isHard AND
                  isFinal AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Hard',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND isHard AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isHard AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Hard',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND isHard THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND isHard THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isHard AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Hard',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND isHard THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND isHard THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Carpet',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isCarpet AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isCarpet AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isCarpet AND
                  isFinal AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Carpet',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  isCarpet AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  isCarpet AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Carpet',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isCarpet AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isCarpet AND isChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isCarpet AND
                  isFinal AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Carpet',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND isCarpet AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isCarpet AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Carpet',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND isCarpet THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND isCarpet THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isCarpet AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Carpet',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND isCarpet THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND isCarpet THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Indoor',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isIndoor AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isIndoor AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isIndoor AND
                  isFinal AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Indoor',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  isIndoor AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  isIndoor AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Indoor',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isIndoor AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isIndoor AND isChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isIndoor AND
                  isFinal AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Indoor',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND isIndoor AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isIndoor AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Indoor',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND isIndoor THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND isIndoor THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isIndoor AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Indoor',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND isIndoor THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND isIndoor THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Outdoor',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isOutdoor AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isOutdoor AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isOutdoor AND
                  isFinal AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Outdoor',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  isOutdoor AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  isOutdoor AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Outdoor',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND isOutdoor AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND isOutdoor AND isChallenger
                  THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isMain AND
                  isOutdoor AND
                  isFinal AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Outdoor',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND isOutdoor AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND isOutdoor AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Outdoor',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND isOutdoor THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND isOutdoor THEN 1
                ELSE 0
              END),
          titles:
            SUM(
              CASE
                WHEN f:Winner AND isFinal AND isMain AND isOutdoor AND isITF THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Environment',
          stat: 'Outdoor',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND isOutdoor THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND isOutdoor THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Winning 1st Set',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND wonSet1 AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND wonSet1 AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Winning 1st Set',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  wonSet1 AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND wonSet1 AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Winning 1st Set',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND wonSet1 AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND wonSet1 AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Winning 1st Set',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND wonSet1 AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND wonSet1 AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Winning 1st Set',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND wonSet1 THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND wonSet1 THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Winning 1st Set',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND wonSet1 THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND wonSet1 THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Losing 1st Set',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND lostSet1 AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND lostSet1 AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Losing 1st Set',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  lostSet1 AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  lostSet1 AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Losing 1st Set',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND lostSet1 AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND lostSet1 AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Losing 1st Set',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isQualifying AND lostSet1 AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isQualifying AND lostSet1 AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Losing 1st Set',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND lostSet1 THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND lostSet1 THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'After Losing 1st Set',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND lostSet1 THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND lostSet1 THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Right-Handers',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND opponentIsRH AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND opponentIsRH AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Right-Handers',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  opponentIsRH AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  opponentIsRH AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Right-Handers',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND opponentIsRH AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND opponentIsRH AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Right-Handers',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  opponentIsRH AND
                  isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  opponentIsRH AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Right-Handers',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND opponentIsRH THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND opponentIsRH THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Right-Handers',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND opponentIsRH THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND opponentIsRH THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Left-Handers',
          level: 'Tour',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND opponentIsLH AND isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND opponentIsLH AND isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Left-Handers',
          level: 'Tour',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  opponentIsLH AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  opponentIsLH AND
                  isNotChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Left-Handers',
          level: 'Challenger',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND isTour AND isMain AND opponentIsLH AND isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND isTour AND isMain AND opponentIsLH AND isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Left-Handers',
          level: 'Challenger',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN
                  f:Winner AND
                  isTour AND
                  isQualifying AND
                  opponentIsLH AND
                  isChallenger
                  THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN
                  f:Loser AND
                  isTour AND
                  isQualifying AND
                  opponentIsLH AND
                  isChallenger
                  THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Left-Handers',
          level: 'ITF',
          type: 'Main',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isMain AND opponentIsLH THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isMain AND opponentIsLH THEN 1
                ELSE 0
              END)
        },
        {
          category: 'Other',
          stat: 'Vs. Left-Handers',
          level: 'ITF',
          type: 'Qualifying',
          wins:
            SUM(
              CASE
                WHEN f:Winner AND isITF AND isQualifying AND opponentIsLH THEN 1
                ELSE 0
              END),
          losses:
            SUM(
              CASE
                WHEN f:Loser AND isITF AND isQualifying AND opponentIsLH THEN 1
                ELSE 0
              END)
        }
      ] AS index
    `,
    { id }
  )

  const player = records[0].toObject()

  interface IndexItem {
    category: string
    stat: string
    level: "Tour" | "Challenger" | "ITF"
    type: "Main" | "Qualifying"
    wins: { low: number; high?: number }
    losses: { low: number; high?: number }
    titles?: { low: number; high?: number }
  }

  const index = player.index.map((statistic: IndexItem) => {
    const { category, stat, level, type, wins, losses, titles } = statistic
    return {
      category: category,
      stat: stat,
      level: level,
      type: type,
      wins: wins?.low,
      losses: losses?.low,
      titles: titles?.low,
      value: losses?.low === 0 ? 0 : (wins?.low / (wins?.low + losses?.low)).toFixed(3)
    }
  })

  return index
})
