export default defineEventHandler(async event => {
  const { letter } = getQuery<{ letter: string }>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (p:Player)-[:REPRESENTS]->(c:Country)
    WHERE toLower(p.last_name) STARTS WITH toLower($letter) AND p.last_name IS NOT NULL
    OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (:Score)-[:SCORED]->
      (:Singles|Doubles)-[:PLAYED]->
      (:Round)-[:ROUND_OF]->
      (e:Event)-[:IN_YEAR]->
      (y:Year)
    WITH
      p,
      c,
      apoc.agg.minItems(y, y.id) AS min_year,
      apoc.agg.maxItems(y, y.id) AS max_year
    ORDER BY toLower(p.last_name)
    RETURN
      apoc.map.clean(
        apoc.map.merge(
          apoc.any.properties(p),
          {min_year: min_year.value, max_year: max_year.value, tour: [x IN labels(p) WHERE NOT x IN ['Player', 'Update', 'Coach']], country: apoc.any.properties(c)}
        ),
        [],
        [null]
      ) AS player
    `,
    { letter }
  )

  const results = records.map((record: any) => record.get("player"))

  return results.map(player => ({
    ...player,
    min_year: player.min_year?.toInt(),
    max_year: player.max_year?.toInt(),
    tour: player.tour[0]
  }))
})
