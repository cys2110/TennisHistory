export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})
      RETURN e.draw_type AS draw_type, e.wiki_link AS wiki_link, e.atp_link AS atp_link
    `,
    { id: Number(id) }
  )

  const results = records[0]?.toObject()

  return results
})
