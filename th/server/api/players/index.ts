export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    sort: "ASC" | "DESC"
  }
  const { letter, skip, sort } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (p:Player)-[:REPRESENTS]->(c:Country)
    WHERE $letter IS NULL OR p.last_name STARTS WITH $letter
    OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (:Score)-[:SCORED]->
      (:Match)-[:PLAYED]->
      (:Round)-[:ROUND_OF]->
      (:Event)-[:IN_YEAR]->
      (y:Year)
    WITH p, c, min(y.id) AS min_year, max(y.id) AS max_year
    ORDER BY p.last_name ${sort}
    WITH
      CASE
        WHEN
          p IS NOT NULL
          THEN
            {
              id: p.id,
              name: p.first_name + ' ' + p.last_name,
              country: {id: c.id, name: c.name, alpha2: c.alpha2},
              min_year: toString(min_year),
              max_year: toString(max_year)
            }
        ELSE null
      END AS player
    WITH COLLECT(player) AS players
    WITH players[toInteger($skip)..toInteger($skip) + 25] AS players, SIZE(players) AS count
    RETURN toString(count) AS count, players
    `,
    { letter: letter === "All" ? null : letter, skip, sort }
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    players: results.players.filter(Boolean).map((p: any) => ({
      ...p,
      min_year: Number(p.min_year),
      max_year: Number(p.max_year)
    }))
  }
})
