export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH y, p
      ORDER BY y.id
      RETURN COLLECT(DISTINCT toString(y.id)) AS years, labels(p) AS labels
    `,
    { id }
  )

  const years = records[0].get("years").map((y: string) => Number(y))
  const labels = records.map(record => record.get("labels"))

  return { years, labels }
})
