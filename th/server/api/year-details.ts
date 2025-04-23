export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year {id: $id})
      OPTIONAL MATCH (t1:Tournament)-[:ESTABLISHED]->(y)
      OPTIONAL MATCH (t2:Tournament)-[:ABOLISHED]->(y)
      OPTIONAL MATCH (c:Country)<-[:REPRESENTS]-(p:Player)
      WITH t1, t2, c, p, y
        ORDER BY t1.name, t2.name, p.last_name
      WITH
        CASE WHEN t1 IS NOT NULL THEN {id: t1.id, name: t1.name} ELSE NULL END AS established_tournaments,
        CASE WHEN t2 IS NOT NULL THEN {id: t2.id, name: t2.name} ELSE NULL END AS abolished_tournaments,
        CASE WHEN p.dob.year = y.id THEN {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}} ELSE NULL END AS born_players,
        CASE WHEN p.dod.year = y.id THEN {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}} ELSE NULL END AS died_players,
        CASE WHEN p.hof = y.id THEN {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}} ELSE NULL END AS hof,
        CASE WHEN (p)-[:RETIRED]->(y) THEN {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}} ELSE NULL END AS retired_players,
        CASE WHEN (p)-[:TURNED_PRO]->(y) THEN {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}} ELSE NULL END AS pro_players
      WITH COLLECT(DISTINCT established_tournaments) AS established_tournaments, COLLECT(DISTINCT abolished_tournaments) AS abolished_tournaments, COLLECT(DISTINCT born_players) AS born_players, COLLECT(DISTINCT died_players) AS died_players, COLLECT(DISTINCT hof) AS hof, COLLECT(DISTINCT retired_players) AS retired_players, COLLECT(DISTINCT pro_players) AS pro_players
      RETURN
        established_tournaments AS established_tournaments,
        abolished_tournaments AS abolished_tournaments,
        born_players AS born_players,
        died_players AS died_players,
        hof AS hof,
        retired_players AS retired_players,
        pro_players AS pro_players
    `,
    { id: Number(id) }
  )

  return records[0].toObject()
})
