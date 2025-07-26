export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    page: string
  }

  const { letter, skip, page } = getQuery<QueryProps>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WHERE $letter IS NULL OR toLower(c.name) STARTS WITH toLower($letter)
    WITH DISTINCT *
    ORDER BY c.name, v.city, v.name
    WITH c, v.city AS city, COLLECT(apoc.any.properties(v)) AS all_venues
    WITH
      c,
      CASE
        WHEN c IS NULL THEN null
        ELSE {city: city, venues: all_venues}
      END AS city
    WITH c, COLLECT(DISTINCT city) AS all_cities
    WITH
      CASE
        WHEN c IS NULL THEN null
        ELSE apoc.map.merge(apoc.any.properties(c), {cities: all_cities})
      END AS country
    WITH COLLECT(DISTINCT country) AS all_countries
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
