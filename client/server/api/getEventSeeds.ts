export default defineEventHandler(async (query) => {
    const { eid } = getQuery<{ eid: string }>(query);

    const { records } = await useDriver().executeQuery(
        `/* cypher */
        OPTIONAL MATCH (:Event {id: $id})<-[:SEEDED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        WITH p, f, c
        ORDER BY f.seed
        RETURN COLLECT ({
          id: p.id,
          name: p.first_name || ' ' || p.last_name,
          last: p.last_name,
          country: c.id,
          seed: toString(f.seed),
          rank: toString(f.rank)
        }) AS seeds
    `,
        { id: parseInt(eid) }
    );

    const event = records.map((record) => record.toObject());

    return event[0].seeds;
});
