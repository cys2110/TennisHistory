export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }
  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:Umpire)
        WHERE $letter IS NULL OR u.last_name STARTS WITH $letter
      WITH u
        ORDER BY u.last_name
      WITH COLLECT(u) AS all, COUNT(u) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS u
      RETURN toString(count) AS count, u.id AS umpire
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const umpires = records.map(record => record.get("umpire"))

  return { count: Number(count), umpires }
})
