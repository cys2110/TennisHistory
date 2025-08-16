export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (t:Tournament WHERE t.name IS NOT NULL)
    OPTIONAL MATCH (t)-[:ESTABLISHED]->(e:Year)
    OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
    WITH *
    ORDER BY t.name
    RETURN
      apoc.map.clean(
        apoc.map.merge(
          properties(t),
          {established: e.id, abolished: a.id, tours: [x IN labels(t) WHERE NOT x IN ['Tournament', 'Update']]}
        ),
        [],
        [null]
      ) AS tournament
    `
  )

  const results = records.map((record: any) => {
    const tournament = record.get("tournament")

    const numberKeys: (keyof typeof tournament)[] = ["id", "established", "abolished"]

    for (const key of numberKeys) {
      if (tournament[key]) {
        tournament[key] = tournament[key].toInt()
      }
    }

    return tournament
  })

  return results
})
