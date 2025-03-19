export default defineEventHandler(async query => {
  const { letter, skip } = getQuery<{ letter: string; skip: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)-[:REPRESENTS]->(c:Country) WHERE $letter IS NULL OR p.last_name STARTS WITH $letter
      WITH COLLECT({player: p, country: c}) AS all, COUNT(p) AS count
      UNWIND all AS p
      ORDER BY p.player.last_name
      SKIP toInteger($skip)
      LIMIT 25
      WITH COLLECT({id: p.player.id, name: p.player.first_name || ' ' || p.player.last_name, country: { id: p.country.id, name: p.country.name, alpha2: p.country.alpha2 } }) AS players, count
      RETURN {count: toString(count), players: players} AS results
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const results = records[0].toObject()

  return results.results
})
