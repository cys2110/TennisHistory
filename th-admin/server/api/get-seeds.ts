export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)-[:ENTERED]->(f:Entry)-[t:SEEDED|Q_SEEDED]->(e:Event {id: toInteger($id)})
      WITH
        CASE WHEN f:Singles THEN 'Singles' ELSE 'Doubles' END AS type,
        CASE WHEN p:ATP THEN 'ATP' WHEN p:WTA THEN 'WTA' WHEN p:Men THEN 'Men' ELSE 'Women' END AS tour,
        properties(f) AS entry,
        t.rank AS rank,
        apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false) AS player
      RETURN DISTINCT apoc.map.mergeList([player, entry, {tour: tour, type: type, rank: rank, pid: player.id}]) AS entry
      ORDER BY entry.tour, entry.type DESC, entry.seed, entry.q_seed
    `,
    { id }
  )

  const seeds = records.map(record => {
    const entry = record.get("entry")
    const numberKeys = ["seed", "q_seed", "rank"]

    for (const key of numberKeys) {
      if (entry[key]) entry[key] = entry[key]?.toInt()
    }

    return entry
  })

  return seeds
})
