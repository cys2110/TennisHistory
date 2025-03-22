export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:REPRESENTS]->(c:Country)
      CALL (p) {
        OPTIONAL MATCH (p)-[:TURNED_PRO]->(t:Year)
        OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
        WITH CASE
          WHEN r IS NOT NULL AND t IS NOT NULL THEN r.id - t.id
          WHEN t IS NOT NULL THEN date().year - t.id
          ELSE NULL
        END AS years_total, CASE
          WHEN t IS NOT NULL AND r IS NOT NULL THEN toString(t.id) || ' - ' || toString(r.id)
          WHEN t IS NOT NULL THEN toString(t.id) || ' - present'
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
        RETURN COLLECT(DISTINCT z) AS coaches
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
      RETURN
        p.first_name || ' ' || p.last_name AS name,
        toString(p.ch) AS ch,
        apoc.temporal.format(p.ch_date, 'dd MMMM YYYY') AS ch_date,
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
        {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        } AS country,
        p.gladiator AS gladiator,
        active_years AS active_years,
        toString(years_total) AS years_total
    `,
    { id }
  )

  const player = records[0].toObject()
  const height = records[0].get("height")
  const coachesObject = records[0].get("coaches")

  const coaches = coachesObject.map((coach: any) => {
    return {
      labels: coach.labels,
      name: coach.properties.first_name + " " + coach.properties.last_name,
      id: coach.properties.id
    }
  })

  return {
    ...player,
    height: height ? Number(height) : null,
    coaches: coaches
  }
})
