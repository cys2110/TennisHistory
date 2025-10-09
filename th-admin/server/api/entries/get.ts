export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)-[:ENTERED]->(f:Entry) WHERE f.id STARTS WITH $id
      WITH
        apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false) AS player,
        CASE WHEN f:Singles THEN 'Singles' ELSE 'Doubles' END AS matchType,
        properties(f) AS entry
      RETURN DISTINCT apoc.map.clean(apoc.map.mergeList([entry, player, {type: matchType, fid: entry.id}]), [], [null]) AS entry
      ORDER BY toLower(entry.last_name), toLower(entry.first_name)
    `,
    { id }
  )

  const entries = records.map(record => {
    const entry = record.get("entry")
    const numberKeys = ["rank", "seed", "q_seed", "points", "pm"]

    for (const key of numberKeys) {
      if (entry[key]) entry[key] = entry[key]?.toInt()
    }

    return entry
  })

  return entries
})
