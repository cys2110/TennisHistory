export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(t:Year)
      OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
      CALL (p) {
        OPTIONAL MATCH (p)-[t:REPRESENTED]->(fc:Country)
        WITH
          CASE
            WHEN
              fc IS NOT NULL
              THEN
                {
                  id: fc.id,
                  name: fc.name,
                  alpha2: fc.alpha2,
                  dates:
                    CASE
                      WHEN t.start_date IS NULL OR t.end_date IS NULL THEN '—'
                      WHEN
                        t.start_date.year = t.end_date.year AND
                        t.start_date.month = t.end_date.year
                        THEN
                          apoc.temporal.format(t.start_date, 'dd') ||
                          '-' ||
                          apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
                      WHEN
                        t.start_date.year = t.end_date.year
                        THEN
                          apoc.temporal.format(t.start_date, 'dd MMMM') ||
                          '-' ||
                          apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
                      ELSE
                        apoc.temporal.format(t.start_date, 'dd MMMM yyyy') ||
                        '-' ||
                        apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
                    END
                }
            ELSE null
          END AS country
        RETURN COLLECT(DISTINCT country) AS countries
      }
      CALL (p) {
        OPTIONAL MATCH (p)<-[:COACHES]-(z:Coach)
        WITH
          CASE
            WHEN
              z IS NOT NULL
              THEN
                {
                  labels: labels(z),
                  id: z.id,
                  name: z.first_name || ' ' || z.last_name
                }
            ELSE null
          END AS coach
        RETURN COLLECT(DISTINCT coach) AS coaches
      }
      RETURN {
        current_singles: p.current_singles,
        current_doubles: p.current_doubles,
        ch_singles: p.ch_singles,
        ch_doubles: p.ch_doubles,
        singles_ch_date: CASE WHEN p.singles_ch_date IS NOT NULL THEN apoc.temporal.format(p.singles_ch_date, 'dd MMMM YYYY') ELSE null END,
        doubles_ch_date: CASE WHEN p.doubles_ch_date IS NOT NULL THEN apoc.temporal.format(p.doubles_ch_date, 'dd MMMM YYYY') ELSE null END,
        pm: apoc.number.format(p.pm, '#,###'),
        coaches: coaches,
        rh: p.rh,
        bh: p.bh,
        height: p.height,
        countries: countries,
        age: CASE
          WHEN p.dod IS NOT NULL AND p.dob IS NOT NULL THEN toString(duration.between(p.dob, p.dod).years)
          WHEN p.dob IS NOT NULL THEN duration.between(p.dob, date()).years
          ELSE null
        END,
        dob: CASE
          WHEN p.dob IS NOT NULL THEN apoc.temporal.format(p.dob, 'EEEE dd MMMM YYYY')
          ELSE null
        END,
        hof: p.hof,
        dod: CASE
          WHEN p.dod IS NOT NULL THEN apoc.temporal.format(p.dod, 'EEEE dd MMMM YYYY')
          ELSE null
        END,
        turned_pro: t.id,
        retired: r.id
      } AS player
    `,
    { id }
  )

  const { records: wlRecords } = await useDriver().executeQuery(
    `/* cypher */
    WITH ['ATP Challenger 125', 'WTA 125'] AS challenger
    MATCH (p:Player {id: $id})
    OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (s:Score)-[:SCORED]->
      (m:Singles|Doubles)-[:PLAYED]->
      (r:Round)-[:ROUND_OF]->
      (e:Event)
    WITH DISTINCT *
    RETURN
      SUM(
        CASE
          WHEN s:Winner AND m:Singles AND m:Best3|Best5 AND m:Main AND e:ITF THEN 1
          ELSE 0
        END) AS itf_singles_wins,
      SUM(
        CASE
          WHEN s:Loser AND m:Singles AND m:Best3|Best5 AND m:Main AND e:ITF THEN 1
          ELSE 0
        END) AS itf_singles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND m:Singles AND r.round = 'Final' AND m:Main AND e:ITF
            THEN 1
          ELSE 0
        END) AS itf_singles_titles,
      SUM(
        CASE
          WHEN
            s:Winner AND m:Singles AND m:Best3|Best5 AND m:Qualifying AND e:ITF
            THEN 1
          ELSE 0
        END) AS itf_q_singles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND m:Singles AND m:Best3|Best5 AND m:Qualifying AND e:ITF
            THEN 1
          ELSE 0
        END) AS itf_q_singles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Singles AND
            m:Best3|Best5 AND
            m:Main AND
            (e.category IN challenger OR
              (e.atp_category IN challenger AND m:ATP) OR
              (e.wta_category IN challenger AND m:WTA))
            THEN 1
          ELSE 0
        END) AS challenger_singles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND
            m:Singles AND
            m:Best3|Best5 AND
            m:Main AND
            (e.category IN challenger OR
              (e.atp_category IN challenger AND m:ATP) OR
              (e.wta_category IN challenger AND m:WTA))
            THEN 1
          ELSE 0
        END) AS challenger_singles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Singles AND
            r.round = 'Final' AND
            m:Main AND
            (e.category IN challenger OR
              (e.atp_category IN challenger AND m:ATP) OR
              (e.wta_category IN challenger AND m:WTA))
            THEN 1
          ELSE 0
        END) AS challenger_singles_titles,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Singles AND
            m:Best3|Best5 AND
            m:Qualifying AND
            (e.category IN challenger OR
              (e.atp_category IN challenger AND m:ATP) OR
              (e.wta_category IN challenger AND m:WTA))
            THEN 1
          ELSE 0
        END) AS challenger_q_singles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND
            m:Singles AND
            m:Best3|Best5 AND
            m:Qualifying AND
            (e.category IN challenger OR
              (e.atp_category IN challenger AND m:ATP) OR
              (e.wta_category IN challenger AND m:WTA))
            THEN 1
          ELSE 0
        END) AS challenger_q_singles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Singles AND
            m:Best3|Best5 AND NOT
            e:ITF AND
            m:Main AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_singles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND
            m:Singles AND
            m:Best3|Best5 AND NOT
            e:ITF AND
            m:Main AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_singles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Singles AND
            r.round = 'Final' AND NOT
            e:ITF AND
            m:Main AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_singles_titles,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Singles AND
            m:Best3|Best5 AND NOT
            e:ITF AND
            m:Qualifying AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_q_singles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND
            m:Singles AND
            m:Best3|Best5 AND NOT
            e:ITF AND
            m:Qualifying AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_q_singles_loss,
      SUM(
        CASE
          WHEN s:Winner AND m:Doubles AND m:Best3|Best5 AND m:Main AND e:ITF THEN 1
          ELSE 0
        END) AS itf_doubles_wins,
      SUM(
        CASE
          WHEN s:Loser AND m:Doubles AND m:Best3|Best5 AND m:Main AND e:ITF THEN 1
          ELSE 0
        END) AS itf_doubles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND m:Doubles AND m:Best3|Best5 AND m:Qualifying AND e:ITF
            THEN 1
          ELSE 0
        END) AS itf_q_doubles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND m:Doubles AND m:Best3|Best5 AND m:Qualifying AND e:ITF
            THEN 1
          ELSE 0
        END) AS itf_q_doubles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND m:Doubles AND r.round = 'Final' AND m:Main AND e:ITF
            THEN 1
          ELSE 0
        END) AS itf_doubles_titles,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Doubles AND
            m:Best3|Best5 AND
            m:Main AND
            e.category IN challenger
            THEN 1
          ELSE 0
        END) AS challenger_doubles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND
            m:Doubles AND
            m:Best3|Best5 AND
            m:Main AND
            e.category IN challenger
            THEN 1
          ELSE 0
        END) AS challenger_doubles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Doubles AND
            m:Best3|Best5 AND
            m:Qualifying AND
            e.category IN challenger
            THEN 1
          ELSE 0
        END) AS challenger_q_doubles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND
            m:Doubles AND
            m:Best3|Best5 AND
            m:Qualifying AND
            e.category IN challenger
            THEN 1
          ELSE 0
        END) AS challenger_q_doubles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Doubles AND
            r.round = 'Final' AND
            m:Main AND
            e.category IN challenger
            THEN 1
          ELSE 0
        END) AS challenger_doubles_titles,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Doubles AND
            m:Best3|Best5 AND NOT
            e:ITF AND
            m:Main AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_doubles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND
            m:Doubles AND
            m:Best3|Best5 AND NOT
            e:ITF AND
            m:Main AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_doubles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Doubles AND
            m:Best3|Best5 AND NOT
            e:ITF AND
            m:Qualifying AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_q_doubles_wins,
      SUM(
        CASE
          WHEN
            s:Loser AND
            m:Doubles AND
            m:Best3|Best5 AND NOT
            e:ITF AND
            m:Qualifying AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_q_doubles_loss,
      SUM(
        CASE
          WHEN
            s:Winner AND
            m:Doubles AND
            r.round = 'Final' AND NOT
            e:ITF AND
            m:Main AND
            (e.category IS NULL OR NOT e.category IN challenger) AND
            (NOT m:ATP OR
              e.atp_category IS NULL OR
              NOT e.atp_category IN challenger) AND
            (NOT m:WTA OR
              e.wta_category IS NULL OR
              NOT e.wta_category IN challenger)
            THEN 1
          ELSE 0
        END) AS tour_doubles_titles
    `,
    { id }
  )

  const player = records[0].get("player")
  const wlResults = wlRecords[0].toObject()
  for (const [key, value] of Object.entries(wlResults)) {
    wlResults[key] = value?.low ?? 0
  }

  return {
    ...player,
    ...wlResults,
    height: player.height?.low,
    turned_pro: player.turned_pro?.low,
    retired: player.retired?.low,
    current_singles: player.current_singles?.low,
    current_doubles: player.current_doubles?.low,
    ch_singles: player.ch_singles?.low,
    ch_doubles: player.ch_doubles?.low,
    age: player.age?.low,
    hof: player.hof?.low
  }
})
