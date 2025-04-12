export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
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
        END AS dod
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
