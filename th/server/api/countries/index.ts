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
    MATCH (c:Country)
    WHERE $letter IS NULL OR toLower(c.name) STARTS WITH toLower($letter)
    WITH *
    ORDER BY toLower(c.name) ${sort ?? "ASC"}
    WITH COLLECT(apoc.any.properties(c)) AS all_countries
    WITH all_countries[(toInteger($page) - 1) * toInteger($skip) .. (toInteger($page) * toInteger($skip)) - 1] AS countries, SIZE(all_countries) AS count
    RETURN countries, count
    `,
    { letter: letter ?? null, skip, page }
  )

  const results = records[0].toObject()

  return {
    count: results.count.toInt(),
    countries: results.countries
  }
})
