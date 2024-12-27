export default defineEventHandler(async (query) => {
  const { eid } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (:Event {id: $id})<-[:ROUND_OF]-(:Round)<-[:PLAYED]-(:Match)<-[:SCORED]-(:Score)<-[:SCORED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        WITH DISTINCT(f), p, c
        ORDER BY f.rank
        WITH COLLECT({id: p.id, name: p.first_name + ' ' + p.last_name, last: p.last_name, country: c.id, rank: f.rank, seed: f.seed, status: f.status}) as entries
        RETURN entries
      `,
    { id: parseInt(eid) }
  );

  const event = records.map((record) => record.toObject());

  return event[0].entries;
});
