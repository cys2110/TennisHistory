export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
  }

  const { letter, skip } = getQuery<QueryProps>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WHERE c.name STARTS WITH $letter
    WITH DISTINCT *
    ORDER BY c.name, v.city, v.name
    WITH c, v.city AS city, CASE
      WHEN v IS NULL
        THEN null
      ELSE
        {
          id: v.id,
          name: v.name
        }
      END AS venue
    WITH c, city, COLLECT(venue) AS all_venues
    WITH c, CASE
        WHEN c IS NULL
          THEN null
        ELSE
          {
            city: city,
            venues: all_venues
          }
      END AS city
    WITH c, COLLECT(city) AS all_cities
    WITH CASE
        WHEN c IS NULL
          THEN null
        ELSE
          {
            country: { id: c.id, name: c.name, alpha2: c.alpha2 },
            cities: all_cities
          }
      END AS country
    WITH COLLECT(country) AS all_countries
    WITH all_countries[toInteger($skip)..toInteger($skip) + 40] AS countries, SIZE(all_countries) AS count
    RETURN countries, count
    `,
    { letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: results.count.low,
    countries: results.countries.filter(Boolean)
  }
})
