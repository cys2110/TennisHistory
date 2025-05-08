export default defineEventHandler(async query => {
  interface QueryProps {
    skip: string
    sort: "ASC" | "DESC"
  }
  const { skip, sort } = getQuery<QueryProps>(query)

  const sortOption = sort === "ASC" ? "u.last_name ASC" : "u.last_name DESC"

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:Umpire)
      WITH u
        ORDER BY ${sortOption}
      WITH COLLECT(u.id) AS umpires, COUNT(u) AS count
      WITH umpires[toInteger($skip)..toInteger($skip) + 25] AS umpires, count
      RETURN toString(count) AS count, umpires
    `,
    { skip }
  )

  const count = records[0].get("count")
  const umpires = records[0].get("umpires")

  return { count: Number(count), umpires }
})
