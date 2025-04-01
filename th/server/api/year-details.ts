export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year {id: $id})
      MATCH (t1:Tournament)-[:ESTABLISHED]->(y)
      MATCH (t2:Tournament)-[:ABOLISHED]->(y)
      MATCH (c1:Country)<-[:REPRESENTS]-(p1:Player)-[:TURNED_PRO]->(y)
      MATCH (c2:Country)<-[:REPRESENTS]-(p2:Player)-[:RETIRED]->(y)
      WITH t1, t2, c1, p1, c2, p2
        ORDER BY t1.name, t2.name, p1.last_name, p2.last_name
      WITH
        CASE WHEN t1 IS NOT NULL THEN {id: t1.id, name: t1.name} ELSE NULL END AS established_tournaments,
        CASE WHEN t2 IS NOT NULL THEN {id: t2.id, name: t2.name} ELSE NULL END AS abolished_tournaments,
        CASE WHEN p1 IS NOT NULL THEN {id: p1.id, name: p1.first_name || ' ' || p1.last_name, country: {id: c1.id, name: c1.name, alpha2: c1.alpha2}} ELSE NULL END AS pro_players,
        CASE WHEN p2 IS NOT NULL THEN {id: p2.id, name: p2.first_name || ' ' || p2.last_name, country: {id: c2.id, name: c2.name, alpha2: c2.alpha2}} ELSE NULL END AS retired_players
      WITH COLLECT(DISTINCT established_tournaments) AS established_tournaments, COLLECT(DISTINCT abolished_tournaments) AS abolished_tournaments, COLLECT(DISTINCT pro_players) AS pro_players, COLLECT(DISTINCT retired_players) AS retired_players
      RETURN {
        established_tournaments: established_tournaments,
        abolished_tournaments: abolished_tournaments,
        pro_players: pro_players,
        retired_players: retired_players
      } AS year
    `,
    { id: Number(id) }
  )

  const results = records[0].toObject()

  return results.year
})
