export default defineEventHandler(async (query) => {
  const { id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Country {id: $id})<-[:REPRESENTS]-(p:Player)
      OPTIONAL MATCH (c)<-[:REPRESENTED]-(o:Player)
      WITH COLLECT(DISTINCT {id: p.id, name: p.first_name || ' ' || p.last_name}) AS players, COLLECT(DISTINCT {id: o.id, name: o.first_name || ' ' || o.last_name}) AS former
      RETURN {
        players: players,
        former: former
      } AS players
    `, { id: id }
  );

  const players = records.map((record) => record.toObject());

  return players[0].players;
});
