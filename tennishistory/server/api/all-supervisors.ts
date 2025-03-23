export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
  }
  const { letter, skip } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Supervisor) WHERE $letter IS NULL OR s.last_name STARTS WITH $letter
      WITH COLLECT(s) AS all, COUNT(s) AS count
      UNWIND all AS s
      ORDER BY s.last_name
      SKIP toInteger($skip)
      LIMIT 25
      RETURN toString(count) AS count, s.id AS supervisor
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const count = records[0].get("count")
  const supervisors = records.map(record => record.get("supervisor"))

  return { count: Number(count), supervisors }
})
