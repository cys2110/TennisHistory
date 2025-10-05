export default defineEventHandler(async event => {
  const { id, type, draw, tour, pm, points, number, round, eid } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($eid)})
      MERGE (r:Round:$($type):$($draw):$($tour) {id: $id, pm: toInteger($pm), points: toInteger($points), number: toInteger($number), round: $round})
      MERGE (r)-[:ROUND_OF]->(e)
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
      round,
      eid
    }
  )

  return summary
})
