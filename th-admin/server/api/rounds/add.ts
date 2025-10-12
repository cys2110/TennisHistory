import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    type: "Singles" | "Doubles"
    draw: "Main" | "Qualifying"
    tour: "ATP" | "WTA" | "Challenger" | "ITF"
    pm: string
    points: string
    number: string
    round: string
    eid: string
  }
  const { id, type, draw, tour, pm, points, number, round, eid } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $eid})
      MERGE (r:Round:$($type):$($draw):$($tour) {id: $id, pm: $pm, points: $points, number: $number, round: $round})
      MERGE (r)-[:ROUND_OF]->(e)
      RETURN r
    `,
    {
      id,
      type,
      tour,
      draw,
      points: points ? int(points) : null,
      pm: pm ? (Number.isInteger(Number(pm)) ? int(pm) : pm) : null,
      number: int(number),
      round,
      eid: int(eid)
    }
  )

  return summary
})
