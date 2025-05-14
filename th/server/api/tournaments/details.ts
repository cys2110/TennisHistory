export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament {id: $id})-[:ESTABLISHED]->(e:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
      RETURN t.website AS website, CASE
        WHEN a IS NULL THEN toString(e.id) || ' — present'
        WHEN e.id = a.id THEN toString(e.id)
        ELSE toString(e.id) || ' — ' || toString(a.id)
      END AS years
    `,
    { id: Number(id) }
  )

  const results = records[0].toObject()

  return results
})
