export default defineEventHandler(async query => {
  const { eid } = getQuery<{ eid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (e:Event {id: $id})<-[t:SEEDED]-(f:Entry)<-[:ENTERED]-(p:Player)
      WITH p, f, t, e
        ORDER BY f.seed
      CALL (f, e) {
        OPTIONAL MATCH (f)-[u:WITHDREW]->(e)
        RETURN CASE WHEN u IS NOT NULL THEN true ELSE FALSE END AS withdrew
      }
      CALL (p, e) {
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(n:Country)
        RETURN CASE
          WHEN x IS NOT NULL AND x.start_date <= e.start_date AND x.end_date > e.start_date THEN {id: n.id, alpha2: n.alpha2, name: n.name}
          ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
        END AS country
      }
      RETURN CASE
        WHEN COUNT(f) > 0 THEN COLLECT(DISTINCT {
          id: toString(p.id),
          name: p.first_name || ' ' || p.last_name,
          last: p.last_name,
          country: country,
          seed: toString(f.seed),
          rank: toString(f.rank),
          rank2: toString(t.rank),
          withdrew: withdrew
        })
        ELSE NULL
      END AS seeds
    `,
    { id: Number(eid) }
  )

  const results = records[0].toObject()

  return results.seeds
})
