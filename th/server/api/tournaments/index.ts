export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    sort: "ASC" | "DESC"
  }
  const { letter, skip, sort } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament) WHERE $letter IS NULL OR t.name STARTS WITH $letter
      MATCH (t)-[:ESTABLISHED]-(e:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]-(a:Year)
      WITH *
      ORDER BY t.name ${sort}
      WITH COLLECT({
        id: toString(t.id),
        name: t.name,
        years: CASE
          WHEN a IS NULL THEN toString(e.id) || ' — present'
          WHEN a.id = e.id THEN toString(e.id)
          ELSE toString(e.id) || ' — ' || toString(a.id)
        END
      }) AS tournaments
      WITH tournaments[toInteger($skip)..toInteger($skip) + 25] AS tournaments, SIZE(tournaments) AS count
      RETURN toString(count) AS count, tournaments
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    tournaments: results.tournaments.filter(Boolean)
  }
})
