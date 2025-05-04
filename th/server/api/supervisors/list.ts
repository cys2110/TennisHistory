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
      WITH CASE WHEN s IS NULL THEN null ELSE {id: s.id, last_name: s.last_name} END AS supervisor
      WITH COLLECT(supervisor) AS all, COUNT(supervisor) AS count
      WITH all[toInteger($skip)..toInteger($skip) + 25] AS supervisors, count
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
