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
      WITH COLLECT(s) AS all, COUNT(s) AS count
      WITH all[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS s
      RETURN toString(count) AS count,
        CASE WHEN s IS NOT NULL THEN {
          id: s.id,
          first_name: s.first_name,
          last_name: s.last_name
        } ELSE NULL END AS supervisor
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const supervisors = records.map(record => record.get("supervisor"))

  return { count: Number(count), supervisors }
})
