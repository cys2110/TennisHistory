export default defineEventHandler(async(query) => {
  const { eid } = getQuery<{ eid: string }>(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})
      MATCH (p:Player)-[:ENTERED]->(f) WHERE f.id STARTS WITH $id
      OPTIONAL MATCH (f)-[t:WITHDREW]->(:Event)
      CALL (p, e) {
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(n:Country)
        RETURN CASE
          WHEN x IS NOT NULL AND x.start_date <= e.start_date AND x.end_date > e.start_date THEN {id: x.id, alpha2: x.alpha2, name: x.name}
          ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
        END AS country
      }
      WITH p, f, t, country
        ORDER BY f.rank
      RETURN COLLECT({
        id: p.id,
        name: p.first_name || ' ' || p.last_name,
        last: p.last_name,
        country: country,
        rank: toString(f.rank),
        seed: toString(f.seed),
        status: f.status,
        withdrew: CASE
          WHEN t IS NOT NULL AND t.reason IS NOT NULL THEN t.reason
          WHEN t IS NOT NULL THEN true
          ELSE false
        END
      }) as entries
    `, { id: eid }
  );

  const event = records.map((record) => record.toObject());

  return event[0].entries;
})
