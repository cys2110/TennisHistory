export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (d:Coach WHERE apoc.text.compareCleaned(d.id, $id))-[t:COACHES|COACHED]->
          (p:Player)-[:REPRESENTS]->
          (c:Country)
      WITH *
      ORDER BY p.last_name
      CALL (p) {
        OPTIONAL MATCH
          (p)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (:Winner)-[:SCORED]->
          (:Match)-[:PLAYED]->
          (:Round {round: 'Final'})-[:ROUND_OF]->
          (e:Event {category: 'Grand Slam'})-[:IN_YEAR]->
          (y:Year)
        OPTIONAL MATCH (e)-[:EDITION_OF]->(x:Tournament)
        RETURN
          CASE
            WHEN
              e IS NOT NULL
              THEN
                {
                  id: toString(e.id),
                  year: toString(y.id),
                  tournament: {id: toString(x.id), name: x.name}
                }
            ELSE null
          END AS gs_win
      }
      WITH p, c, d, t, COLLECT(gs_win) AS gs_wins, [x IN labels(p) WHERE NOT x IN ['Update', 'Player', 'Coach']][0] AS tour
      RETURN
        apoc.map.mergeList([
          apoc.map.submap(
            p,
            [
              'id',
              'first_name',
              'last_name',
              'ch_singles',
              'singles_ch_date',
              'ch_doubles',
              'doubles_ch_date'
            ],
            null,
            false
          ),
          properties(t),
          {country: properties(c), gs: gs_wins, tour: tour}
        ]) AS player
    `,
    { id }
  )

  const players = records.map(record => {
    const player = record.get("player")

    const dateKeys = ["singles_ch_date", "doubles_ch_date", "start_date", "end_date"]
    const numberKeys = ["ch_singles", "ch_doubles"]

    for (const key of dateKeys) {
      if (player[key]) {
        player[key] = {
          year: player[key].year?.toInt(),
          month: player[key].month?.toInt(),
          day: player[key].day?.toInt()
        }
      }
    }

    for (const key of numberKeys) {
      if (player[key]) player[key] = player[key].toInt()
    }

    return player
  })

  return players
})
