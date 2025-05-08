export default defineEventHandler(async query => {
  interface QueryProps {
    skip: string
    sort: "ASC" | "DESC"
  }
  const { skip, sort } = getQuery<QueryProps>(query)

  const sortOption = sort === "ASC" ? "s.last_name ASC" : "s.last_name DESC"

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (s:Supervisor)
      WITH s
        ORDER BY ${sortOption}
      WITH COLLECT(s.id) AS supervisors, COUNT(s) AS count
      WITH supervisors[toInteger($skip)..toInteger($skip) + 25] AS supervisors, count
      RETURN toString(count) AS count, supervisors
    `,
    { skip }
  )

  const count = records[0].get("count")
  const supervisors = records[0].get("supervisors")

  return {
    count: Number(count),
    supervisors
  }
})
