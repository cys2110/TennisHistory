import { int } from "neo4j-driver"

export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(:Event {id: $id})
      OPTIONAL MATCH (u:Umpire)-[:UMPIRED]->(m)
      WITH
        CASE WHEN m:Singles THEN 'Singles' ELSE 'Doubles' END AS type,
        CASE WHEN m:Main THEN 'Main' ELSE 'Qualifying' END AS draw,
        CASE WHEN m:ATP THEN 'ATP' WHEN m:WTA THEN 'WTA' WHEN m:Men THEN 'Men' ELSE 'Women' END AS tour,
        COLLECT(DISTINCT p.first_name || ' ' || p.last_name) AS players,
        properties(m) AS match,
        u.id AS umpire,
        CASE WHEN m.incomplete IS NULL AND s.serve1 IS NULL THEN FALSE ELSE TRUE END AS stats,
        CASE WHEN m:Best3 THEN 'Best3' WHEN m:Best5 THEN 'Best5' ELSE NULL END AS best_of,
        r.round AS round
      RETURN DISTINCT apoc.map.merge(match, {tour: tour, draw: draw, type: type, players: players, umpire: umpire, stats: stats, round: round, best_of: best_of}) AS match
      ORDER BY match.tour, match.type DESC, match.draw, match.number
    `,
    { id: int(id) }
  )

  const matches = records.map(record => {
    const match = record.get("match")
    match["match_no"] = match["match_no"].toInt()
    if (match["date"]) match["date"] = match["date"].toStandardDate().toISOString().slice(0, 10)
    if (match["duration"]) {
      const seconds = match["duration"].seconds.toInt()
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60
      match["duration"] = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`
    }

    return match
  })

  return matches
})
