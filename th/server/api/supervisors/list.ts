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
      WITH COLLECT(s) AS all, COUNT(s) AS count
      WITH all[toInteger($skip)..toInteger($skip) + 25] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS s
      RETURN toString(count) AS count,
      CASE
        WHEN s IS NOT NULL THEN {last_name: s.last_name, id: s.id}
        ELSE NULL
      END AS supervisor
    `,
    { skip }
  )

  const count = records[0].get("count")
  const supervisors = records.map((record: any) => record.get("supervisor"))

  return {
    count: Number(count),
    supervisors: supervisors.filter(supervisor => supervisor !== null)
  }
})
