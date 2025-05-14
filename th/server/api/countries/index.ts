export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    sort: "ASC" | "DESC"
  }
  const { letter, skip, sort } = getQuery<QueryProps>(query)

  const sortOption = sort === "ASC" ? "c.name ASC" : "c.name DESC"

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Country) WHERE $letter IS NULL OR c.name STARTS WITH $letter
      WITH c
      ORDER BY ${sortOption}
      WITH CASE WHEN c IS NOT NULL THEN {id: c.id, name: c.name, alpha2: c.alpha2} ELSE NULL END AS country
      WITH COLLECT(country) AS countries, COUNT(country) AS count
      WITH countries[toInteger($skip)..toInteger($skip) + 25] AS countries, count
      RETURN toString(count) AS count, countries
    `,
    { letter: letter === "All" ? null : letter, skip, sort }
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    countries: results.countries.filter(Boolean)
  }
})
