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
      WITH CASE WHEN s IS NULL THEN null ELSE {id: s.id, last_name: s.last_name} END AS supervisor
      WITH COLLECT(supervisor) AS all, COUNT(supervisor) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS supervisors, count
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
