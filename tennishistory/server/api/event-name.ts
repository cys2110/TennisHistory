export default defineEventHandler(async query => {
  const { eid } = getQuery<{ eid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament)<-[:EDITION_OF]-(e:Event {id: $id})
      RETURN {
        name: t.name,
        draw_type: e.draw_type
      } AS tournament
    `,
    { id: Number(eid) }
  )

  const results = records[0].toObject()

  return results.tournament
})
