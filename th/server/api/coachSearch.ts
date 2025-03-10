export default defineEventHandler(async (query) => {
  const { id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Coach {id: $id})-[:COACHES]->(p:Player)-[:REPRESENTS]->(c:Country)
      RETURN COLLECT(DISTINCT {id: p.id, name: p.first_name || ' ' || p.last_name, country: { id: c.id, name: c.name, alpha2: c.alpha2}}) AS players
    `, { id: id }
  );

  const players = records.map((record) => record.toObject());

  return players[0].players;
});
