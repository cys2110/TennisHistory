export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament {id: $id})
      OPTIONAL MATCH (t)-[:ESTABLISHED]->(e:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
      RETURN apoc.map.merge(apoc.any.properties(t), {tours: [x IN labels(t) WHERE NOT x IN ['Update', 'Tournament']], established: e.id, abolished: a.id}) AS tournament
    `,
    { id: Number(id) }
  )

  const results = records[0].get("tournament")

  return {
    ...results,
    id: results.id?.toInt(),
    established: results.established?.toInt(),
    abolished: results.abolished?.toInt()
  }
})
