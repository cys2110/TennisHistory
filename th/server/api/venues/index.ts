export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    sort: "ASC" | "DESC"
  }
  const { letter, skip, sort } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WHERE $letter IS NULL OR c.name STARTS WITH $letter
    WITH DISTINCT c
    ORDER BY c.name ${sort}
    WITH COLLECT(c) AS countries, COUNT(c) AS count
    WITH countries[toInteger($skip)..toInteger($skip) + 25] AS countries, count
    UNWIND
      CASE
        WHEN countries = [] THEN [null]
        ELSE countries
      END AS country
    MATCH (v:Venue)-[:LOCATED_IN]->(country)
    WITH v, country, count
    ORDER BY country.name ${sort}, v.city, v.name
    WITH country, v.city AS city, COLLECT({name: v.name, id: v.id}) AS venues, count
    WITH country, COLLECT({
      city: city,
      venues: venues
    }) AS cities, count
    RETURN
      toString(count) AS count,
      CASE
        WHEN
          country IS NOT NULL
          THEN
            {
              country: {id: country.id, name: country.name, alpha2: country.alpha2},
              cities: cities
            }
        ELSE null
      END AS country
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const count = records[0].get("count")
  const countries = records.map(record => record.get("country"))

  return {
    count: Number(count),
    countries: countries.filter(Boolean)
  }
})
