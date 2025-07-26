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
    MATCH (u:Umpire)
    WHERE $letter IS NULL OR toLower(u.last_name) STARTS WITH toLower($letter)
    WITH *
    ORDER BY toLower(u.last_name) ${sort ?? "ASC"}
    WITH COLLECT(u.id) AS all_umpires
    WITH all_umpires[(toInteger($page) - 1) * toInteger($skip) .. (toInteger($page) * toInteger($skip)) - 1] AS umpires, SIZE(all_umpires) AS count
    RETURN umpires, count
    `,
    { letter: letter ?? null, skip, page }
  )

  const results = records[0].toObject()

  return {
    count: results.count.toInt(),
    umpires: results.umpires
  }
})
