export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (p:Player)-[:REPRESENTS]->(c:Country)
    OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (:Score)-[:SCORED]->
      (:Singles|Doubles)-[:PLAYED]->
      (:Round)-[:ROUND_OF]->
      (:Event)-[:IN_YEAR]->
      (y:Year)
    OPTIONAL MATCH (coach:Coach)-[t:COACHES|COACHED]->(p)
    WITH
      p,
      c,
      [x IN labels(p) WHERE x IN ['ATP', 'WTA']][0] AS tour,
      apoc.agg.minItems(y, y.id) AS min_year,
      apoc.agg.maxItems(y, y.id) AS max_year,
      CASE
        WHEN COUNT(coach) = 0 THEN []
        ELSE
          COLLECT(
            DISTINCT
            apoc.map.clean(
              apoc.map.merge(
                apoc.map.submap(
                  coach,
                  ['id', 'first_name', 'last_name'],
                  null,
                  false
                ),
                {
                  labels: labels(coach),
                  start_year: t.start_date,
                  end_year: t.end_date
                }
              ),
              [],
              [null]
            ))
      END AS coaches
    RETURN
      apoc.map.clean(
        apoc.map.merge(
          apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false),
          {
            country: properties(c),
            tour: tour,
            min_year: min_year.value,
            max_year: max_year.value,
            coaches: coaches
          }
        ),
        [],
        [null]
      ) AS player
    ORDER BY player.last_name
    `
  )

  const results = records.map(record => {
    const player = record.get("player")

    if (player.min_year) player.min_year = player.min_year.toInt()
    if (player.max_year) player.max_year = player.max_year.toInt()

    for (const coach of player.coaches) {
      if (coach.start_year) {
        coach.start_year = coach.start_year?.year?.toInt()
      }
      if (coach.end_year) coach.end_year = coach.end_year?.year?.toInt()
    }

    return player
  })

  return results
})
