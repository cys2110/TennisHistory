export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)-[:ENTERED]->(f:Entry)-[t:WALKOVER]->(e:Event {id: toInteger($id)})
      WITH
        CASE WHEN f:Singles THEN 'Singles' ELSE 'Doubles' END AS type,
        properties(f) AS entry,
        properties(t) AS walkover,
        apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false) AS player
      RETURN DISTINCT apoc.map.mergeList([player, entry, walkover, {type: type, pid: player.id}]) AS entry
      ORDER BY entry.type DESC
    `,
    { id }
  )

  const entries = records.map(record => record.get("entry"))

  return entries
})
