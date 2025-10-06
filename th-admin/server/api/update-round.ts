import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    type: "Singles" | "Doubles"
    draw: string
    tour: string
    pm?: string
    points?: string
    number: string
    round: string
  }

  const { id, type, draw, tour, pm, points, number, round } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (r:Round:$($type):$($draw):$($tour) {id: $id})
      SET r.pm = $pm, r.points = $points, r.number = $number, r.round = $round
      RETURN r
    `,
    {
      id,
      type,
      tour,
      draw,
      points: points ? int(points) : null,
      pm: pm ? (Number.isInteger(Number(pm)) ? int(pm) : Number(pm)) : null,
      number: int(number),
      round
    }
  )

  return summary
})
