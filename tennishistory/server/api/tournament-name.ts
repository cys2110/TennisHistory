export default defineEventHandler(async query => {
  const { tid } = getQuery<{ tid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament {id: $id})-[:ESTABLISHED]->(y1:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]->(y2:Year)
      RETURN {
        name: t.name,
        website: t.website,
        years: CASE
            WHEN y2.id IS NULL THEN toString(y1.id) || ' - present'
            WHEN y2.id = y1.id THEN toString(y1.id)
            ELSE toString(y1.id) || ' - ' || toString(y2.id)
        END
      } AS tournament
    `,
    { id: Number(tid) }
  )

  const results = records[0].toObject()

  return results.tournament
})
