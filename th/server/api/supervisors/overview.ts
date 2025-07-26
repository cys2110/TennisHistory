export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Supervisor)-[:SUPERVISED]->(:Event)-[:IN_YEAR]->(y:Year) WHERE apoc.text.compareCleaned(s.id, $id)
      WITH s, y
      ORDER BY y.id
      WITH s, COLLECT(DISTINCT toString(y.id)) AS years
      RETURN apoc.map.merge(apoc.any.properties(s), {years: years, labels: labels(s)}) AS supervisor
    `,
    { id }
  )

  const results = records[0].get("supervisor")

  return results
})
