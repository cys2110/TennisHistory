export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Surface {id: $id})<-[:ON_SURFACE]-(e:Event)-[:IN_YEAR]->(y:Year)
      WITH y
      ORDER BY y.id
      RETURN DISTINCT toString(y.id) AS year
    `,
    { id }
  )

  const results = records.map(record => record.get("year"))

  return results
})
