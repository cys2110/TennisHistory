export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    letter: string
  }
  const { letter, id } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    OPTIONAL MATCH (p:Player)-[:REPRESENTS|REPRESENTED]->(c:Country {id: $id})
    WHERE toLower(p.last_name) STARTS WITH toLower($letter)
    WITH p
    ORDER BY toLower(p.last_name)
    OPTIONAL MATCH (p)-[:REPRESENTS]->(c:Country)
    OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (:Score)-[:SCORED]->
      (:Singles|Doubles)-[:PLAYED]->
      (:Round)-[:ROUND_OF]->
      (:Event)-[:IN_YEAR]->
      (y:Year)
    WITH p, c, min(y.id) AS min_year, max(y.id) AS max_year
    RETURN
      CASE
        WHEN
          p IS NOT NULL
          THEN
            {
              tour: labels(p),
              id: p.id,
              name: p.first_name || ' ' || p.last_name,
              last_name: p.last_name,
              country: {id: c.id, name: c.name, alpha2: c.alpha2},
              min_year: min_year,
              max_year: max_year
            }
        ELSE null
      END AS player
    `,
    { id, letter }
  )

  const results = records.map(record => record.get("player")).filter(Boolean)

  return results.map((player: any) => ({
    ...player,
    min_year: player.min_year?.low ?? 0,
    max_year: player.max_year?.low ?? 0,
    tour: player.tour.includes("ATP") ? "ATP" : "WTA"
  }))
})
