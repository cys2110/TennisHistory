export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (c:Coach {id: $id})
    RETURN {
      id: c.id,
      name: c.first_name || ' ' || c.last_name,
    } AS coach
    `,
    { id }
  )

  return records[0].get("coach")
})
