export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Umpire {id: $id})-[:UMPIRED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH y
      ORDER BY y.id
      RETURN DISTINCT toString(y.id) AS years
    `,
    { id }
  )

  const results = records.map(record => record.get("years"))

  return results
})
