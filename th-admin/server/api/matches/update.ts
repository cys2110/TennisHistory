import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  const { id, tour, draw, type, match_no, court, date, incomplete, duration, umpire, round, best_of } = getQuery(event)

  const [hours, minutes, seconds] = duration ? (duration as string).split(":").map((x: string) => parseInt(x, 10)) : [0, 0, 0]

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (m:Match:$($tour):$($draw):$($type) {id: $id})-[t:PLAYED]->(r:Round)
      SET m.match_no = $match_no,
          m.court = $court,
          m.date = $date,
          m.incomplete = $incomplete,
          m.duration = duration({hours: $hours, minutes: $minutes, seconds: $seconds})
      CALL (m) {
        WHEN $umpire IS NOT NULL THEN {
          MATCH (u:Umpire {id: $umpire})
          MERGE (u)-[:UMPIRED]->(m)
        }
      }
      CALL (m, r, t) {
        WHEN r.round <> $round {
          MATCH (r1:Round:$($tour):$($draw):$($type) {round: $round}) WHERE r1.id STARTS WITH $eid
          MERGE (m)-[:PLAYED]->(r1)
          DELETE t
        }
      }
      CALL (m) {
        WHEN NOT m:Best3 AND $best_of = 'Best3' THEN {
          SET m:Best3
          REMOVE m:Best5
        }
        WHEN NOT m:Best5 AND $best_of = 'Best5' THEN {
          SET m:Best5
          REMOVE m:Best3
        }
      }
      RETURN m
    `,
    {
      id,
      tour,
      draw,
      type,
      match_no: int(match_no as string),
      court,
      date,
      incomplete,
      hours,
      minutes,
      seconds,
      umpire,
      round,
      best_of,
      eid: (id as string).split(" ")[0]
    }
  )

  return summary
})
