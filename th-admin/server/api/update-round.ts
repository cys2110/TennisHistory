export default defineEventHandler(async event => {
  const { id, type, draw, tour, pm, points, number, round } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (r:Round:$($type):$($draw):$($tour) {id: $id})
      SET r.pm = toInteger($pm), r.points = toInteger($points), r.number = toInteger($number), r.round = $round
      RETURN r
    `,
    {
      id,
      type,
      tour,
      draw,
      points: points ?? null,
      pm: pm ?? null,
      number,
      round
    }
  )

  return summary
})
