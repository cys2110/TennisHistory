export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    page: string
    nameSort: SortType
    establishedSort: SortType
    abolishedSort: SortType
  }

  const { letter, skip, nameSort, establishedSort, abolishedSort, page } = getQuery<QueryProps>(event)

  const sortBy =
    establishedSort ? `e.id ${establishedSort}, toLower(t.name)`
    : abolishedSort ? `a.id ${abolishedSort}, toLower(t.name)`
    : `toLower(t.name) ${nameSort ?? "ASC"}`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (t:Tournament WHERE ($letter IS NULL OR toLower(t.name) STARTS WITH toLower($letter)) AND t.name IS NOT NULL)
    OPTIONAL MATCH (t)-[:ESTABLISHED]->(e:Year)
    OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
    WITH *
    ORDER BY ${sortBy}
    WITH
      apoc.map.clean(
        apoc.map.merge(
          properties(t),
          {established: e.id, abolished: a.id, tours: [x IN labels(t) WHERE NOT x IN ['Tournament', 'Update']]}
        ),
        [],
        [null]
      ) AS tournament
    WITH COLLECT(tournament) AS all_tournaments
    WITH
      all_tournaments[(toInteger($page) - 1) * toInteger($skip) .. (toInteger($page) * toInteger($skip)) - 1] AS tournaments,
      SIZE(all_tournaments) AS count
    RETURN tournaments, count
    `,
    { letter: letter ?? null, skip, page }
  )

  const results = records[0].toObject()

  const numberKeys: (keyof (typeof results.tournaments)[0])[] = ["id", "established", "abolished"]

  for (const tournament of results.tournaments) {
    for (const key of numberKeys) {
      if (tournament[key]) {
        tournament[key] = tournament[key].toInt()
      }
    }
  }

  return {
    count: results.count.toInt(),
    tournaments: results.tournaments
  }
})
