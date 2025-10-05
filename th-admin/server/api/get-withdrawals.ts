export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (p:Player)-[:ENTERED]->(f:Entry)-[t:WITHDREW|Q_WITHDREW]->(e:Event {id: toInteger($id)})
      WITH
        CASE WHEN f:Singles THEN 'Singles' ELSE 'Doubles' END AS type,
        CASE WHEN type(t) = 'WITHDREW' THEN 'Main' ELSE 'Qualifying' END AS draw,
        properties(f) AS entry,
        properties(t) AS withdrawal,
        apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false) AS player
      CALL (*) {
        WHEN withdrawal.team_mate IS NOT NULL THEN {
          MATCH (tm:Player {id: withdrawal.team_mate})
          RETURN {id: tm.id, label: tm.first_name + ' ' + tm.last_name} AS team_mate
        }
        ELSE RETURN null AS team_mate
      }
      RETURN DISTINCT apoc.map.mergeList([player, entry, withdrawal, {draw: draw, type: type, pid: player.id, team_mate: team_mate}]) AS entry
      ORDER BY entry.type DESC
    `,
    { id }
  )

  const entries = records.map(record => record.get("entry"))

  return entries
})
