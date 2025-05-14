export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
    skip: string
    sort: "ASC" | "DESC"
  }

  const { id, sort, skip } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (c:Country {id: $id})<-[:LOCATED_IN]-(v:Venue)
      WITH *
      ORDER BY v.city ${sort}
      WITH CASE
        WHEN
          v IS NOT NULL
          THEN {id: v.id, name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}
        ELSE NULL
      END AS venue
      WITH COLLECT(venue) AS venues, COUNT(venue) AS count
      WITH venues[toInteger($skip)..toInteger($skip) + 25] AS venues, count
      RETURN toString(count) AS count, venues

    `,
    { id, skip }
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    venues: results.venues.filter(Boolean)
  }
})
