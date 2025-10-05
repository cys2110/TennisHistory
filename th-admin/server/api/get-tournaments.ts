export default defineEventHandler(async query => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament)
      OPTIONAL MATCH (t)-[:ESTABLISHED]->(e:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
      WITH [x IN labels(t) WHERE x <> 'Tournament'] AS tours, properties(t) AS tournament, e.id AS established, a.id AS abolished
      RETURN apoc.map.merge(tournament, {tours: tours, established: established, abolished: abolished}) AS tournament
      ORDER BY toLower(tournament.name), tournament.id
    `
  )

  const tournaments = records.map(r => {
    const tournament = r.get("tournament")
    return {
      ...tournament,
      id: tournament.id.toInt(),
      established: tournament.established?.toInt() || undefined,
      abolished: tournament.abolished?.toInt() || undefined
    }
  })

  return tournaments
})
