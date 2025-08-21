export default defineEventHandler(async query => {
  const { searchTerm } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p:Player)-[:REPRESENTS]->(x:Country) WHERE p.first_name + ' ' + p.last_name =~ '(?i).*'+ $searchTerm + '.*'
      WITH p, x
      ORDER BY p.last_name
      RETURN CASE WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT{value: p.id, label: p.first_name || ' ' || p.last_name, country: { id: x.id, name: x.name, alpha2: x.alpha2}}) ELSE [] END AS players
    `,
    { searchTerm }
  )

  const results = records[0].toObject()

  return results.players
})
