export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
  }
  const { letter, skip } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:Umpire) WHERE $letter IS NULL OR u.last_name STARTS WITH $letter
      WITH COLLECT(u) AS all, COUNT(u) AS count
      UNWIND all AS u
      ORDER BY u.last_name
      SKIP toInteger($skip)
      LIMIT 25
      RETURN toString(count) AS count, u.id AS umpire
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const count = records[0].get("count")
  const umpires = records.map(record => record.get("umpire"))

  return { count: Number(count), umpires }
})
