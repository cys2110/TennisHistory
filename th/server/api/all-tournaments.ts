export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }
  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament) WHERE $letter IS NULL OR t.name STARTS WITH $letter
      WITH t
      ORDER BY t.name
      WITH COLLECT(t) AS all, COUNT(t) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS t
      MATCH (t)-[:ESTABLISHED]-(e:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]-(a:Year)
      RETURN toString(count) AS count, {
        id: toString(t.id),
        name: t.name,
        years: CASE
          WHEN a IS NULL THEN toString(e.id) || ' — present'
          WHEN a.id = e.id THEN toString(e.id)
          ELSE toString(e.id) || ' — ' || toString(a.id)
        END
      } AS tournament
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const tournaments = records.map(record => record.get("tournament"))

  return { count: Number(count), tournaments }
})
