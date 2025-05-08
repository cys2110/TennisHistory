export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }
  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (s:Supervisor)
        WHERE $letter IS NULL OR s.last_name STARTS WITH $letter
      WITH s
        ORDER BY s.last_name
      WITH COLLECT(s.id) AS supervisors, COUNT(s) AS count
      WITH supervisors[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS supervisors, count
      RETURN toString(count) AS count, supervisors
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const supervisors = records[0].get("supervisors")

  return {
    count: Number(count),
    supervisors
  }
})
