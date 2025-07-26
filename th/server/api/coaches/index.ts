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
    MATCH (c:Coach)
    WHERE $letter IS NULL OR toLower(c.last_name) STARTS WITH toLower($letter)
    WITH *
    ORDER BY toLower(c.last_name) ${sort ?? "ASC"}
    WITH COLLECT(apoc.any.properties(c)) AS all_coaches
    WITH all_coaches[(toInteger($page) - 1) * toInteger($skip) .. (toInteger($page) * toInteger($skip)) - 1] AS coaches, SIZE(all_coaches) AS count
    RETURN coaches, count
    `,
    { letter: letter ?? null, skip, page }
  )

  const results = records[0].toObject()

  return {
    count: results.count.toInt(),
    coaches: results.coaches
  }
})
