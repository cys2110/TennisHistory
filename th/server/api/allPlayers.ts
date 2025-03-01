export default defineEventHandler(async(query) => {
  const { letter, skip } = getQuery<{letter: string, skip: string}>(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)-[:REPRESENTS]->(c:Country) WHERE $letter IS NULL OR p.last_name STARTS WITH $letter
      WITH p, c
      ORDER BY p.last_name
      SKIP toInteger($skip)
      LIMIT 24
      RETURN COLLECT({id: p.id, name: p.first_name || ' ' || p.last_name, country: { id: c.id, name: c.name, alpha2: c.alpha2}}) AS players
    `, { letter: letter === 'All' ? null : letter, skip }
  )

  const results = records.map((record) => record.toObject());

  const { records: count } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player) WHERE $letter IS NULL OR p.last_name STARTS WITH $letter
      RETURN COUNT(p) AS count
    `, { letter: letter === 'All' ? null : letter }
  )

  const countResults = count.map((record) => record.toObject());

  return {count: countResults[0].count, players: results[0].players}
})
