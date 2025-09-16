export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (c:Coach) WHERE apoc.text.compareCleaned(c.id, $id)
    WITH c, [x IN labels(c) WHERE x <> 'Coach'] As labels
    RETURN apoc.map.merge(apoc.map.submap(c, ['id', 'first_name', 'last_name']), {labels: labels}) AS coach
    `,
    { id }
  )

  return records[0].get("coach")
})
