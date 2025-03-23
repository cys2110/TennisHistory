export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
  }
  const { letter, skip } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (v:Venue) WHERE $letter IS NULL OR v.city STARTS WITH $letter
      WITH COLLECT(DISTINCT v.city) AS cities, COUNT(DISTINCT v.city) AS count
      UNWIND cities AS c
      ORDER BY c
      SKIP toInteger($skip)
      LIMIT 25
      WITH c, count
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
      } AS cities
    `,
    { letter: letter === "All" ? null : letter, skip }
  )

  const count = records[0].get("count")
  const cities = records.map(record => record.get("cities"))

  return { count: Number(count), cities }
})
