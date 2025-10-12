import { int, Integer } from "neo4j-driver"

export default defineEventHandler(async event => {
  const { id, type, draw, tour, round, match_no, sets, player_1, player_2, player_3, player_4, incomplete, winner } = getQuery(event)

  const team1: Record<string, Integer> = {}
  const team2: Record<string, Integer> = {}

  for (let i = 1; i <= 5; i++) {
    const set = getQuery(event)[`s${i}`]
    const tb = getQuery(event)[`t${i}`]
    if (set && (set as string[])[0] !== "undefined" && (set as string[])[1] !== "undefined") {
      const team1Set = parseInt((set as string[])[0])
      team1[`s${i}`] = int((set as string[])[0])
      team2[`s${i}`] = int((set as string[])[1])

      if (tb) {
        const tbNumber = parseInt(tb as string)
        if (team1Set === 7) {
          team1[`t${i}`] = int(tbNumber)
          team2[`t${i}`] = int(tbNumber < 6 ? 7 : tbNumber + 2)
        } else {
          team2[`t${i}`] = int(tbNumber)
          team1[`t${i}`] = int(tbNumber < 6 ? 7 : tbNumber + 2)
        }
      }
    }
  }

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (r:Round:$($tour):$($draw):$($type) {round: $round}) WHERE r.id STARTS WITH $id

      OPTIONAL MATCH (p1:Player)-[:ENTERED]->(f1:Entry:$($type) {id: $player_1})
      OPTIONAL MATCH (p2:Player)-[:ENTERED]->(f2:Entry:$($type) {id: $player_2})
      OPTIONAL MATCH (p3:Player)-[:ENTERED]->(f3:Entry:$($type) {id: $player_3})
      OPTIONAL MATCH (p4:Player)-[:ENTERED]->(f4:Entry:$($type) {id: $player_4})

      MERGE (m:Match:$($tour):$($draw):$($type) {id: $id || ' ' || toString($match_no), match_no: $match_no})
      MERGE (m)-[:PLAYED]->(r)
      SET m.incomplete = $incomplete

      CALL (m) {
        WHEN $incomplete IS NULL THEN {
          SET m:$($sets)
        }
      }

      CALL (*) {
        WHEN $player_1 IS NOT NULL THEN {
          MERGE (s1:Score:$($type):$($tour):$($draw) {id: m.id || ' ' || p1.id})
          MERGE (f1)-[:SCORED]->(s1)
          MERGE (s1)-[:SCORED]->(m)
          CALL (*) {
            WHEN $type = 'Singles' THEN {
              SET s1:P1
            } ELSE {
              MERGE (f2)-[:SCORED]->(s1)
              SET s1:T1, s1.id = s1.id || ' ' || p2.id
            }
          }
          CALL (s1) {
            WHEN $winner IS NOT NULL AND $winner IN ['Player 1', 'Team 1'] THEN SET s1:Winner
            WHEN $winner IS NOT NULL THEN SET s1:Loser
          }
          CALL (s1) {
            WHEN $team1 IS NOT NULL THEN SET s1 += $team1
          }
        }
      }
      CALL (*) {
        WHEN $player_3 IS NOT NULL THEN {
          MERGE (s2:Score:$($type):$($tour):$($draw) {id: m.id || ' ' || p3.id})
          MERGE (f3)-[:SCORED]->(s2)
          MERGE (s2)-[:SCORED]->(m)
          CALL (*) {
            WHEN $type = 'Singles' THEN {
              SET s2:P2
            } ELSE {
              MERGE (f4)-[:SCORED]->(s2)
              SET s2:T2, s2.id = s2.id || ' ' || p4.id
            }
          }
          CALL (s2) {
            WHEN $winner IS NOT NULL AND $winner IN ['Player 2', 'Team 2'] THEN SET s2:Winner
            WHEN $winner IS NOT NULL THEN SET s2:Loser
          }
          CALL (s2) {
            WHEN $team2 IS NOT NULL THEN SET s2 += $team2
          }
        }
      }
    `,
    {
      id,
      type,
      draw,
      tour,
      round,
      match_no: int(match_no as string),
      sets: sets ?? null,
      player_1: player_1 ?? null,
      player_2: player_2 ?? null,
      player_3: player_3 ?? null,
      player_4: player_4 ?? null,
      incomplete: incomplete ?? null,
      team1: Object.keys(team1).length ? team1 : null,
      team2: Object.keys(team2).length ? team2 : null,
      winner: winner ?? null
    }
  )

  return summary
})
