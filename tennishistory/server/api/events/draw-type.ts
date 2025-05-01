export default defineEventHandler(async query => {
  const { eid } = getQuery<{ eid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $eid})
      RETURN e.draw_type AS draw_type
    `,
    { eid: Number(eid) }
  )

  const results = records[0].get("draw_type")

  return results
})
