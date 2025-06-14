export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    sort: SortType
  }

  const { letter, skip, sort } = getQuery<QueryProps>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (s:Supervisor)
    WHERE toLower(s.last_name) STARTS WITH toLower($letter)
    WITH *
    ORDER BY toLower(s.last_name) ${sort ?? "ASC"}
    WITH CASE
      WHEN s IS NULL
        THEN null
      ELSE
        {
          id: s.id,
          name: s.first_name || ' ' || s.last_name
        }
      END AS supervisor
    WITH COLLECT(supervisor) AS all_supervisors
    WITH all_supervisors[toInteger($skip)..toInteger($skip) + 40] AS supervisors, SIZE(all_supervisors) AS count
    RETURN supervisors, count
    `,
    { letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: results.count.low,
    supervisors: results.supervisors.filter(Boolean)
  }
})
