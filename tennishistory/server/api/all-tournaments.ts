export default defineEventHandler(async query => {
  const { letter, skip } = getQuery<{ letter: string; skip: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament) WHERE $letter IS NULL OR t.name STARTS WITH $letter
      WITH COLLECT(t) AS all, COUNT(t) AS count
      UNWIND all AS t
      ORDER BY t.name
      SKIP toInteger($skip)
      LIMIT 25
      WITH COLLECT({id: toString(t.id), name: t.name}) AS tournaments, count
      RETURN {count: toString(count), tournaments: tournaments} AS results
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const results = records[0].toObject()

  return results.results
})
