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

  const results = records.map(record => record.get("tournament"))

  const numberKeys: (keyof (typeof results)[0])[] = ["id", "established", "abolished"]

  for (const tournament of results) {
    for (const key of numberKeys) {
      if (tournament[key]) {
        tournament[key] = tournament[key].toInt()
      }
    }

    tournament["tours"] = getCorrectTours(tournament["tours"])
  }

  return results
})
