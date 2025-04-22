export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Umpire {id: $id})-[:UMPIRED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year)
      WITH y
      ORDER BY y.id
      RETURN COLLECT(DISTINCT toString(y.id)) AS years
    `,
    { id }
  )

  const results = records[0].get("years")

  return results
})
