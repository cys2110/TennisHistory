import { int } from "neo4j-driver"

export default defineEventHandler(async query => {
  const { id, type } = getQuery<{ id: string; type: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)-[:ENTERED]->(f:Entry)-[t:$($type)]->(e:Event {id: $id})
      WITH
        CASE WHEN f:Singles THEN 'Singles' ELSE 'Doubles' END AS type,
        properties(f) AS entry,
        properties(t) AS retirement,
        apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false) AS player
      RETURN DISTINCT apoc.map.mergeList([player, entry, retirement, {type: type, pid: player.id}]) AS entry
      ORDER BY entry.type DESC
    `,
    { id: int(id), type }
  )

  const entries = records.map(record => record.get("entry"))

  return entries
})
