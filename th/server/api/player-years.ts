export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH y
      ORDER BY y.id
      RETURN DISTINCT toString(y.id) AS year
    `,
    { id }
  )

  return records.map(record => Number(record.get("year")))
})
