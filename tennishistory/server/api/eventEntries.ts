export default defineEventHandler(async (query) => {
  const { eid } = getQuery<{ eid: string }>(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Event {id: $id})<-[:ROUND_OF]-(:Round)<-[:PLAYED]-(:Match)<-[:SCORED]-(:Score)<-[:SCORED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
      WITH DISTINCT f, p, c
      ORDER BY f.rank
      RETURN COLLECT({
        id: p.id,
        name: p.first_name || ' ' || p.last_name,
        last: p.last_name,
        country_id: c.id,
        country_name: c.name,
        rank: toString(f.rank),
        seed: toString(f.seed),
        status: f.status
      }) as entries
    `, { id: parseInt(eid) }
  );

  const event = records.map((record) => record.toObject());

  return event[0].entries;
});
