import { int } from "neo4j-driver"

export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)-[:ENTERED]->(f:Entry)-[t:LDA|Q_LDA]->(e:Event {id: $id})
      WITH
        CASE WHEN f:Singles THEN 'Singles' ELSE 'Doubles' END AS type,
        CASE WHEN type(t) = 'LDA' THEN 'Main' ELSE 'Qualifying' END AS draw,
        t.rank AS rank,
        apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false) AS player,
        f
      RETURN DISTINCT apoc.map.merge(player, {draw: draw, type: type, rank: rank, fid: f.id}) AS entry
      ORDER BY entry.type DESC, entry.draw
    `,
    { id: int(id) }
  )

  const entries = records.map(record => {
    const entry = record.get("entry")

    if (entry["rank"]) entry["rank"] = entry["rank"].toInt()

    return entry
  })

  return entries
})
