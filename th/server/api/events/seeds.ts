export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records: mainRecords } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH
        (e:Event {id: $id})<-[t:SEEDED]-(f:Entry)<-[:ENTERED]-(p:Player)
      WITH *
      ORDER BY f.seed
      CALL (f, e) {
        OPTIONAL MATCH (f)-[u:WITHDREW]->(e)
        RETURN
          CASE
            WHEN u IS NOT NULL THEN true
            ELSE false
          END AS withdrew
      }
      CALL (p, e) {
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(n:Country)
        RETURN
          CASE
            WHEN
              x IS NOT NULL AND
              x.start_date <= e.start_date AND
              x.end_date > e.start_date
              THEN {id: n.id, alpha2: n.alpha2, name: n.name}
            ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
          END AS country
      }
      RETURN
        CASE
          WHEN
            COUNT(f) > 0
            THEN
              COLLECT(
                DISTINCT
                {
                  id: toString(p.id),
                  name: p.first_name || ' ' || p.last_name,
                  last: p.last_name,
                  tour: labels(p),
                  country: country,
                  seed: f.seed,
                  rank: f.rank,
                  rank2: t.rank,
                  withdrew: withdrew,
                  type: labels(f)
                }
              )
          ELSE []
        END AS seeds
    `,
    { id: Number(id) }
  )

  const { records: qualRecords } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH
        (e:Event {id: $id})<-[t:Q_SEEDED]-(f:Entry)<-[:ENTERED]-(p:Player)
      WITH *
      ORDER BY f.q_seed
      CALL (f, e) {
        OPTIONAL MATCH (f)-[u:Q_WITHDREW]->(e)
        RETURN
          CASE
            WHEN u IS NOT NULL THEN true
            ELSE false
          END AS withdrew
      }
      CALL (p, e) {
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(n:Country)
        RETURN
          CASE
            WHEN
              x IS NOT NULL AND
              x.start_date <= e.start_date AND
              x.end_date > e.start_date
              THEN {id: n.id, alpha2: n.alpha2, name: n.name}
            ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
          END AS country
      }
      RETURN
        CASE
          WHEN
            COUNT(f) > 0
            THEN
              COLLECT(
                DISTINCT
                {
                  id: toString(p.id),
                  name: p.first_name || ' ' || p.last_name,
                  last: p.last_name,
                  tour: labels(p),
                  country: country,
                  seed: f.q_seed,
                  rank: f.rank,
                  rank2: t.rank,
                  withdrew: withdrew,
                  type: labels(f)
                }
              )
          ELSE []
        END AS seeds
    `,
    { id: Number(id) }
  )

  const mainResults = mainRecords[0].get("seeds")
  const qualResults = qualRecords[0].get("seeds")

  const mainSeeds = mainResults.filter(Boolean).map((seed: any) => ({
    ...seed,
    type: seed.type.includes("Doubles") ? "Doubles" : "Singles",
    tour: seed.tour.includes("ATP") ? "ATP" : "WTA",
    seed: seed.seed?.low || 0,
    rank: seed.rank?.low || 0,
    rank2: seed.rank2?.low || 0
  }))

  const qualSeeds = qualResults.filter(Boolean).map((seed: any) => ({
    ...seed,
    type: seed.type.includes("Doubles") ? "Doubles" : "Singles",
    tour: seed.tour.includes("ATP") ? "ATP" : "WTA",
    seed: seed.seed?.low || 0,
    rank: seed.rank?.low || 0,
    rank2: seed.rank2?.low || 0
  }))

  return { mainSeeds, qualSeeds }
})
