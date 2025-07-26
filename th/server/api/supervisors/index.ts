export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    page: string
    sort: SortType
  }

  const { letter, skip, sort, page } = getQuery<QueryProps>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (s:Supervisor)
    WHERE $letter IS NULL OR toLower(s.last_name) STARTS WITH toLower($letter)
    WITH *
    ORDER BY toLower(s.last_name) ${sort ?? "ASC"}
    WITH COLLECT(s.id) AS all_supervisors
    WITH all_supervisors[(toInteger($page) - 1) * toInteger($skip) .. (toInteger($page) * toInteger($skip)) - 1] AS supervisors, SIZE(all_supervisors) AS count
    RETURN supervisors, count
    `,
    { letter: letter ?? null, skip, page }
  )

  const results = records[0].toObject()

  return {
    count: results.count.toInt(),
    supervisors: results.supervisors
  }
})
