export default defineEventHandler(async query => {
  const { skip, nameSort, citySort, countrySort } = getQuery(query)

  let sort = "x.name, v.city, v.name"

  if (nameSort) {
    if (nameSort === "ASC") sort = "v.name, v.city, x.name"
    if (nameSort === "DESC") sort = "v.name DESC, v.city, x.name"
  } else if (citySort) {
    if (citySort === "ASC") sort = "v.city, v.name, x.name"
    if (citySort === "DESC") sort = "v.city DESC, v.name, x.name"
  } else {
    if (countrySort === "DESC") sort = "x.name DESC, v.city, v.name"
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (v:Venue)-[:LOCATED_IN]->(x:Country)
      WITH v, x
        ORDER BY ${sort}
      WITH CASE
        WHEN v IS NOT NULL THEN {
          id: v.id,
          name: v.name,
          city: v.city,
          country: {
            id: x.id,
            name: x.name,
            alpha2: x.alpha2
          }
        }
        ELSE []
      END AS venue
      WITH COLLECT(venue) AS venues, COUNT(venue) AS count
      WITH venues[toInteger($skip)..toInteger($skip) + 25] AS venues, count
      RETURN toString(count) AS count, venues
    `,
    { skip }
  )

  const count = records[0].get("count")
  const venues = records[0].get("venues")

  return {
    count: Number(count),
    venues
  }
})
