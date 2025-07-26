export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    page: string
    nameSort: SortType
    startSort: SortType
    endSort: SortType
    countrySort: SortType
  }

  const { letter, skip, nameSort, startSort, endSort, countrySort, page } = getQuery<QueryProps>(event)

  const sortBy =
    startSort ? `min_year ${startSort}, toLower(p.last_name)`
    : endSort ? `max_year ${endSort}, toLower(p.last_name)`
    : countrySort ? `c.name ${countrySort}, toLower(p.last_name)`
    : `toLower(p.last_name) ${nameSort ?? "ASC"}`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (p:Player)-[:REPRESENTS]->(c:Country)
    WHERE ($letter IS NULL OR toLower(p.last_name) STARTS WITH toLower($letter)) AND p.last_name IS NOT NULL
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
    ORDER BY ${sortBy}
    WITH
      apoc.map.clean(
        apoc.map.merge(
          apoc.any.properties(p),
          {min_year: min_year.value, max_year: max_year.value, tour: [x IN labels(p) WHERE NOT x IN ['Player', 'Update', 'Coach']], country: apoc.any.properties(c)}
        ),
        [],
        [null]
      ) AS player
    WITH COLLECT(player) AS all_players
    WITH all_players[(toInteger($page) - 1) * toInteger($skip) .. (toInteger($page) * toInteger($skip)) - 1] AS players, SIZE(all_players) AS count
    RETURN players, count
    `,
    { letter: letter ?? null, skip, page }
  )

  const results = records[0].toObject()

  return {
    count: results.count.toInt(),
    players: results.players.map((player: any) => ({
      ...player,
      min_year: player.min_year?.toInt(),
      max_year: player.max_year?.toInt(),
      tour: player.tour[0]
    }))
  }
})
