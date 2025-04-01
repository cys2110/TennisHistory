export default defineEventHandler(async query => {
  interface QueryProps {
    letter: string
    skip: string
    limit: string
  }
  const { letter, skip, limit } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Coach) WHERE $letter IS NULL OR c.last_name STARTS WITH $letter
      WITH COLLECT(c) AS all, COUNT(c) AS count
      UNWIND all AS c
      OPTIONAL MATCH (c)-[:REPRESENTS]->(x:Country)
      ORDER BY c.last_name
      SKIP toInteger($skip)
      LIMIT toInteger($limit)
      WITH c, CASE
        WHEN x IS NOT NULL THEN {id: x.id, name: x.name, alpha2: x.alpha2}
        ELSE NULL
      END AS country, count
      RETURN toString(count) AS count, c AS coach, country
    `,
    { letter: letter === "All" ? null : letter, skip, limit }
  )

  const count = records[0].get("count")
  const coachesObjects = records.map(record => record.toObject())
  const coaches = coachesObjects.map(object => {
    return {
      labels: object.coach.labels,
      id: object.coach.properties.id,
      name: object.coach.properties.first_name + " " + object.coach.properties.last_name,
      country: object.country
    }
  })

  return { count: Number(count), coaches }
})
