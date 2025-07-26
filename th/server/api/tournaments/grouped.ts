export default defineEventHandler(async event => {
  const { letter } = getQuery<{ letter: string }>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (t:Tournament)
    WHERE toLower(t.name) STARTS WITH toLower($letter) AND t.name IS NOT NULL
    OPTIONAL MATCH (t)-[:ESTABLISHED]->(e:Year)
    OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
    WITH *
    ORDER BY t.name
    RETURN
      apoc.map.clean(
        apoc.map.merge(
          apoc.any.properties(t),
          {established: e.id, abolished: a.id, tours: [x IN labels(t) WHERE NOT x IN ['Tournament', 'Update']]}
        ),
        [],
        [null]
      ) AS tournament
    `,
    { letter }
  )

  const results = records.map((record: any) => record.get("tournament"))

  return results.map(tournament => ({
    ...tournament,
    established: tournament.established?.toInt(),
    abolished: tournament.abolished?.toInt(),
    id: tournament.id.toInt()
  }))
})
