export default defineEventHandler(async query => {
  interface QueryProps {
    id: string
  }
  const { id } = getQuery<QueryProps>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (c:Country {id: $id})<-[:LOCATED_IN]-(v:Venue)
      WITH v, c
      ORDER BY v.city
      RETURN CASE WHEN v IS NOT NULL
        THEN {name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}
        ELSE NULL
      END AS venue
    `,
    { id }
  )

  const venues = records.map(record => record.get("venue"))

  return venues.filter(venue => venue !== null)
})
