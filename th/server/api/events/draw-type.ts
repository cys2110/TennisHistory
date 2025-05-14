export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})
      RETURN e.draw_type AS draw_type
    `,
    { id: Number(id) }
  )

  const results = records[0]?.get("draw_type") ?? null

  return results
})
