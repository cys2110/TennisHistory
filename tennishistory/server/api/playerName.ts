export default defineEventHandler(async (query) => {
  const { id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:REPRESENTS]->(c:Country)
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(tp:Year)
      OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
      WITH p, c, tp, r, CASE
        WHEN r.id IS NOT NULL AND tp.id IS NOT NULL THEN r.id - tp.id
        WHEN r.id IS NULL AND tp.id IS NOT NULL THEN date().year - tp.id
        ELSE NULL
      END AS active
      RETURN {
        name: p.first_name || ' ' || p.last_name,
        country: c.id,
        years_active: CASE
          WHEN tp.id IS NOT NULL AND r.id IS NULL THEN toString(tp.id) || '- present'
          WHEN tp.id IS NOT NULL AND r.id IS NOT NULL THEN toString(tp.id) || '-' || toString(r.id)
          ELSE NULL
        END,
        active_years: toString(active),
        gladiator: p.gladiator
      } AS player
    `, { id }
  )

  const player = records.map((record) => record.toObject());

  return player[0].player;
})
