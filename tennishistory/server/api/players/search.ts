export default defineEventHandler(async query => {
  const { searchTerm } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p:Player)-[:REPRESENTS]->(c:Country) WHERE p.first_name + ' ' + p.last_name =~ '(?i).*'+ $searchTerm + '.*'
      WITH *
      ORDER BY p.last_name
      RETURN apoc.map.clean(apoc.map.merge(apoc.map.submap(p, ['id', 'first_name', 'last_name']), {country: properties(c)}), [], [null]) AS player
    `,
    { searchTerm }
  )

  const results = records.map(r => r.get("player"))

  if (Object.keys(results[0]).length === 0) {
    return []
  } else {
    return results
  }
})
