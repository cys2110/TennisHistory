export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (p:Player {id: $id})-[:ENTERED]->
        (:Entry)-[:SCORED]->
        (s:Score)-[:SCORED]->
        (m:Match)-[:PLAYED]->
        (:Round {round: 'Final'})-[:ROUND_OF]->
        (e:Event)-[:EDITION_OF]->
        (t:Tournament)
      MATCH (e)-[:IN_YEAR]->(y:Year)
      OPTIONAL MATCH (e)-[:ON_SURFACE]->(s1:Surface)
      OPTIONAL MATCH (m)-[:PLAYED]->(:Tie)-[:ON_SURFACE]->(s2:Surface)
      WITH
        *,
        CASE
          WHEN e.start_date IS NOT NULL THEN e.start_date
          WHEN p:ATP AND e.atp_start_date IS NOT NULL THEN e.atp_start_date
          WHEN p:ATP THEN e.men_start_date
          WHEN p:WTA AND p.wta_start_date IS NOT NULL THEN e.wta_start_date
          ELSE e.women_start_date
        END AS start_date
      ORDER BY start_date
      OPTIONAL MATCH (p1:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(s)
      WHERE p1.id <> p.id
      RETURN
        apoc.map.merge(
          apoc.any.properties(e),
          {
            year: y.id,
            tournament: apoc.any.properties(t),
            level:
              CASE
                WHEN e:Women OR e:Men THEN 'ITF'
                WHEN
                  (e:ATP AND e.atp_category IN $challenger) OR
                  (e:WTA AND e.wta_category IN $challenger)
                  THEN 'Challenger'
                ELSE 'Tour'
              END,
            type:
              CASE
                WHEN e.draw_type = 'Country draw' THEN 'Team'
                WHEN m:Singles THEN 'Singles'
                ELSE 'Doubles'
              END,
            partner: apoc.any.properties(p1),
            titles:
              CASE
                WHEN s:Winner THEN 'Titles'
                ELSE 'Finals'
              END,
            surface:
              CASE
                WHEN s1 IS NULL THEN s2.id
                ELSE s1.id
              END
          }
        ) AS event
    `,
    { id, challenger: CHALLENGER_CATEGORIES }
  )

  const results = records.map(record => {
    const event = record.get("event")
    const dateKeys = [
      "start_date",
      "end_date",
      "atp_start_date",
      "atp_end_date",
      "wta_start_date",
      "wta_end_date",
      "men_start_date",
      "men_end_date",
      "women_start_date",
      "women_end_date"
    ]

    for (const key of dateKeys) {
      if (event[key]) {
        event[key] = {
          year: event[key].year?.toInt(),
          month: event[key].month?.toInt(),
          day: event[key].day?.toInt()
        }
      }
    }

    return {
      ...event,
      id: event.id.toInt(),
      year: event.year.toInt(),
      tournament: {
        ...event.tournament,
        id: event.tournament.id.toInt()
      }
    }
  })

  return results
})
