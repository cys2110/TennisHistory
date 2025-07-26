export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:Umpire)-[:UMPIRED]->(:Singles|Doubles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year) WHERE apoc.text.compareCleaned(u.id, $id)
      WITH u, y
      ORDER BY y.id
      WITH u, COLLECT(DISTINCT toString(y.id)) AS years
      RETURN apoc.map.merge(apoc.any.properties(u), {years: years, labels: labels(u)}) AS umpire
    `,
    { id }
  )

  const results = records[0].get("umpire")

  return results
})
