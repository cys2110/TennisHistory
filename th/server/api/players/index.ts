export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    nameSort: SortType
    startSort: SortType
    endSort: SortType
    countrySort: SortType
  }

  const { letter, skip, nameSort, startSort, endSort, countrySort } = getQuery<QueryProps>(event)

  const sortBy =
    startSort ? `min_year ${startSort}, toLower(p.last_name)`
    : endSort ? `max_year ${endSort}, toLower(p.last_name)`
    : countrySort ? `c.name ${countrySort}, toLower(p.last_name)`
    : `toLower(p.last_name) ${nameSort ?? "ASC"}`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (p:Player)-[:REPRESENTS]->(c:Country)
    WHERE toLower(p.last_name) STARTS WITH toLower($letter)
    OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (:Score)-[:SCORED]->
      (:Singles|Doubles)-[:PLAYED]->
      (:Round)-[:ROUND_OF]->
      (e:Event)-[:IN_YEAR]->
      (y:Year)
      WITH p, c, min(y.id) AS min_year, max(y.id) AS max_year
    ORDER BY ${sortBy}
    WITH CASE
      WHEN p IS NULL
        THEN null
      ELSE
        {
          id: p.id,
          name: p.first_name || ' ' || p.last_name,
          tour: labels(p),
          country: { id: c.id, name: c.name, alpha2: c.alpha2 },
          min_year: min_year,
          max_year: max_year
        }
      END AS player
    WITH COLLECT(player) AS all_players
    WITH all_players[toInteger($skip)..toInteger($skip) + 40] AS players, SIZE(all_players) AS count
    RETURN players, count
    `,
    { letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: results.count.low,
    players: results.players.filter(Boolean).map((player: any) => ({
      ...player,
      min_year: player.min_year?.low,
      max_year: player.max_year?.low,
      tour: player.tour.includes("ATP") ? "ATP" : "WTA"
    }))
  }
})
