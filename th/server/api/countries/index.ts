export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    sort: SortType
  }

  const { letter, skip, sort } = getQuery<QueryProps>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (c:Country)
    WHERE c.name STARTS WITH $letter
    WITH *
    ORDER BY c.name ${sort ?? "ASC"}
    WITH CASE
      WHEN c IS NULL
        THEN null
      ELSE
        {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
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
