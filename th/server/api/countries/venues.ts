export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (c:Country {id: $id})<-[:LOCATED_IN]-(v:Venue)
      WITH *
      ORDER BY v.city
      RETURN CASE
        WHEN
          v IS NOT NULL
          THEN {id: v.id, name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}
        ELSE null
      END AS venue

    `,
    { id }
  )

  const results = records.map(record => record.get("venue")).filter(Boolean)

  return results
})
