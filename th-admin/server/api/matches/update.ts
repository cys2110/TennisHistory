import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  const { id, tour, draw, type, match_no, court, date, incomplete, duration, umpire } = getQuery(event)

  const [hours, minutes, seconds] = duration ? (duration as string).split(":").map((x: string) => parseInt(x, 10)) : [0, 0, 0]

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (m:Match:$($tour):$($draw):$($type) {id: $id})
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
      umpire
    }
  )

  return summary
})
