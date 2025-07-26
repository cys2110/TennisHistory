export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    page: string
    countrySort: SortType
    citySort: SortType
    venueSort: SortType
  }

  const { letter, skip, page, countrySort, citySort, venueSort } = getQuery<QueryProps>(event)

  const sortBy =
    venueSort ? `toLower(v.name) ${venueSort}, toLower(c.name), toLower(v.city)`
    : citySort ? `toLower(v.city) ${citySort}, toLower(c.name), toLower(v.name)`
    : `toLower(c.name) ${countrySort ?? "ASC"}, toLower(v.city), toLower(v.name)`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WHERE $letter IS NULL OR toLower(c.name) STARTS WITH toLower($letter)
    WITH DISTINCT *
    ORDER BY ${sortBy}
    WITH apoc.map.merge(apoc.any.properties(v), {country: apoc.any.properties(c)}) AS venue
    WITH COLLECT(venue) AS all_venues
    WITH all_venues[(toInteger($page) - 1) * toInteger($skip) .. (toInteger($page) * toInteger($skip)) - 1] AS venues, SIZE(all_venues) AS count
    RETURN venues, count
    `,
    { letter: letter ?? null, skip, page }
  )

  const results = records[0].toObject()

  return {
    count: results.count.toInt(),
    venues: results.venues
  }
})
