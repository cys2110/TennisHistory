export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(t:Year)
      OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
      CALL (p) {
        OPTIONAL MATCH (p)-[t:REPRESENTED]->(fc:Country)
        WITH CASE
          WHEN fc IS NOT NULL THEN {
            id: fc.id,
            name: fc.name,
            alpha2: fc.alpha2,
            dates: CASE
              WHEN t.start_date IS NULL OR t.end_date IS NULL THEN '—'
              WHEN t.start_date.year = t.end_date.year AND t.start_date.month = t.end_date.year THEN apoc.temporal.format(t.start_date, 'dd') || '-' || apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
              WHEN t.start_date.year = t.end_date.year THEN apoc.temporal.format(t.start_date, 'dd MMMM') || '-' || apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
              ELSE apoc.temporal.format(t.start_date, 'dd MMMM yyyy') || '-' || apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
            END
          }
          ELSE NULL
        END AS country
        RETURN COLLECT(DISTINCT country) AS countries
      }
      CALL (p) {
        OPTIONAL MATCH (p)<-[:COACHES]-(z:Coach)
        RETURN COLLECT(DISTINCT {labels: labels(z), id: z.id, name: z.first_name || ' ' || z.last_name}) AS coaches
      }
      CALL (p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Match)-[:PLAYED]->(r:Round)
WITH DISTINCT s, m, r
        RETURN SUM(CASE WHEN s:Winner AND (m:Best3 OR m:Best5) THEN 1 ELSE 0 END) AS win, SUM(CASE WHEN s:Loser AND (m:Best3 OR m:Best5) THEN 1 ELSE 0 END) AS loss, SUM(CASE WHEN s:Winner AND r.round = 'Final' THEN 1 ELSE 0 END) AS titles
      }
      RETURN
        toString(p.ch) AS ch,
        CASE WHEN p.ch_date IS NOT NULL THEN apoc.temporal.format(p.ch_date, 'dd MMMM YYYY') ELSE NULL END AS ch_date,
        toString(win) || '-' || toString(loss) AS wl,
        toString(titles) AS titles,
        apoc.number.format(p.pm, '#,###') AS pm,
        coaches AS coaches,
        p.rh AS rh,
        p.bh AS bh,
        toString(p.height) AS height,
        countries AS countries,
        CASE
          WHEN p.dod IS NOT NULL THEN toString(duration.between(p.dob, p.dod).years)
          WHEN p.dob IS NOT NULL THEN toString(duration.between(p.dob, date()).years)
          ELSE NULL
        END AS age,
        CASE
          WHEN p.dob IS NOT NULL THEN apoc.temporal.format(p.dob, 'EEEE dd MMMM YYYY')
          ELSE NULL
        END AS dob,
        toString(p.hof) AS hof,
        CASE
          WHEN p.dod IS NOT NULL THEN apoc.temporal.format(p.dod, 'EEEE dd MMMM YYYY')
          ELSE NULL
        END AS dod,
        toString(t.id) AS pro,
        toString(r.id) AS retired
    `,
    { id }
  )

  const player = records[0].toObject()

  return {
    ...player,
    height: player.height ? Number(player.height) : null,
    pro: player.pro ? Number(player.pro) : null,
    retired: player.retired ? Number(player.retired) : null
  }
})
