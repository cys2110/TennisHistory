export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event) WHERE apoc.text.compareCleaned(e.category, $id)
      WITH e
      LIMIT 1
      RETURN e.category AS category
    `,
    { id }
  )

  const results = records[0].get("category")

  return results
})
