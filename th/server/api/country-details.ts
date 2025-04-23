export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records: playersResults } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Country {id: $id})
      RETURN {id: c.id, name: c.name, alpha2: c.alpha2} AS country
    `,
    { id }
  )

  const country = playersResults[0].get("country")

  return country
})
