export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:REPRESENTS]->(c:Country)
      CALL (p) {
        OPTIONAL MATCH (p)-[:TURNED_PRO]->(tp:Year)
        OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
        WITH CASE
          WHEN r.id IS NOT NULL AND tp.id IS NOT NULL THEN r.id - tp.id
          WHEN r.id IS NULL AND tp.id IS NOT NULL THEN date().year - tp.id
          ELSE NULL
        END AS years_total, CASE
          WHEN tp.id IS NOT NULL AND r.id IS NULL THEN toString(tp.id) || ' - present'
          WHEN tp.id IS NOT NULL AND r.id IS NOT NULL THEN toString(tp.id) || '-' || toString(r.id)
          ELSE NULL
        END AS active_years
        RETURN years_total, active_years
      }
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
        WITH CASE
          WHEN z IS NOT NULL THEN {id: z.id, name: z.first_name || ' ' || z.last_name}
          ELSE []
        END AS coach
        RETURN COLLECT(DISTINCT coach) AS coaches
      }
      CALL (p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(w:Winner)-[:SCORED]->(:Best3 | Best5)
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(l:Loser)-[:SCORED]->(:Best3 | Best5)
        WITH COUNT(DISTINCT(w)) AS win, COUNT(DISTINCT(l)) AS loss
        RETURN win, loss
      }
      CALL (p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(w:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})
        RETURN COUNT(DISTINCT(w)) AS titles
      }
      RETURN {
        name: p.first_name || ' ' || p.last_name,
        ch: toString(p.ch),
        ch_date: apoc.temporal.format(p.ch_date, 'dd MMMM YYYY'),
        wl: toString(win) || '-' || toString(loss),
        titles: toString(titles),
        pm: apoc.number.format(p.pm, '#,###'),
        coaches: coaches,
        rh: p.rh,
        bh: p.bh,
        height: toString(p.height),
        countries: countries,
        age: CASE
          WHEN p.dod IS NOT NULL THEN toString(duration.between(p.dob, p.dod).years)
          WHEN p.dob IS NOT NULL THEN toString(duration.between(p.dob, date()).years)
          ELSE NULL
        END,
        dob: CASE
          WHEN p.dob IS NOT NULL THEN apoc.temporal.format(p.dob, 'EEEE dd MMMM YYYY')
          ELSE NULL
        END,
        hof: toString(p.hof),
        dod: CASE
          WHEN p.dod IS NOT NULL THEN apoc.temporal.format(p.dod, 'EEEE dd MMMM YYYY')
          ELSE NULL
        END,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        gladiator: p.gladiator,
        active_years: active_years,
        years_total: toString(years_total)
      } AS player
    `,
    { id }
  )

  const player = records[0].toObject()

  return player.player
})
