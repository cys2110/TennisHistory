export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    sort: "ASC" | "DESC"
  }
  const { letter, skip, sort } = getQuery<QueryProps>(query)

  const sortOption = sort === "ASC" ? "u.last_name ASC" : "u.last_name DESC"

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (u:Umpire)
        WHERE $letter IS NULL OR u.last_name STARTS WITH $letter
      WITH u
        ORDER BY ${sortOption}
      WITH COLLECT(u.id) AS umpires, COUNT(u) AS count
      WITH umpires[toInteger($skip)..toInteger($skip) + 25] AS umpires, count
      RETURN toString(count) AS count, umpires
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    umpires: results.umpires.filter(Boolean)
  }
})
