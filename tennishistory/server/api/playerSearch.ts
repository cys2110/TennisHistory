export default defineEventHandler(async (query) => {
  const { searchTerm } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p:Player)-[:REPRESENTS]->(x:Country) WHERE p.first_name + ' ' + p.last_name =~ '(?i).*'+ $searchTerm + '.*'
      WITH CASE WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT{value: p.id, label: p.first_name || ' ' || p.last_name, country: x.id}) ELSE [] END AS players
      RETURN players
    `, { searchTerm }
  );

  const results = records.map((record) => record.toObject());

  return results[0].players;
});
