export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }
  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (v:Venue)
        WHERE $letter IS NULL OR v.city STARTS WITH $letter
      WITH v
        ORDER BY v.city
      WITH COLLECT(DISTINCT v.city) AS cities, COUNT(DISTINCT v.city) AS count
      WITH cities[toInteger($skip)..toInteger($skip) + toInteger($limit)] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS c
      MATCH (v:Venue {city: c})-[:LOCATED_IN]->(x:Country)
      WITH c, x, COLLECT({name: v.name, id: v.id}) AS venues, count
      RETURN count, {
        city: c,
        venues: venues,
        country: {
          id: x.id,
          name: x.name,
          alpha2: x.alpha2
        }
      } AS city
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const cities = records.map(record => record.get("city"))

  return { count: Number(count), cities }
})
