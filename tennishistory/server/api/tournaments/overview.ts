export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament {id: $id})
      OPTIONAL MATCH (t)-[:ESTABLISHED]->(e:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
      RETURN
        apoc.map.clean(
          apoc.map.merge(
            properties(t),
            {
              tours: [x IN labels(t) WHERE NOT x IN ['Update', 'Tournament']],
              established: e.id,
              abolished: a.id
            }
          ),
          [],
          [null]
        ) AS tournament
    `,
    { id: Number(id) }
  )

  const results = records[0].get("tournament")

  const numberKeys: (keyof typeof results)[] = ["established", "abolished"]
  numberKeys.forEach(key => {
    if (results[key]) {
      results[key] = results[key].toInt()
    }
  })

  return results
})
