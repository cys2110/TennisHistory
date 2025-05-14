export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    sort: "ASC" | "DESC"
  }
  const { letter, skip, sort } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (s:Supervisor)
      WHERE $letter IS NULL OR s.last_name STARTS WITH $letter
      WITH s
      ORDER BY ${sort}
      WITH COLLECT(s.id) AS supervisors, COUNT(s) AS count
      WITH supervisors[toInteger($skip)..toInteger($skip) + 25] AS supervisors, count
      RETURN toString(count) AS count, supervisors
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    supervisors: results.supervisors.filter(Boolean)
  }
})
