export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    nameSort: SortType
    citySort: SortType
    countrySort: SortType
  }

  const { letter, skip, nameSort, citySort, countrySort } = getQuery<QueryProps>(event)

  const sortBy =
    citySort ? `v.city ${citySort}, c.name, v.name`
    : nameSort ? `v.name ${nameSort}, c.name, v.city`
    : `c.name ${countrySort ?? "ASC"}, v.city, v.name`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WHERE c.name STARTS WITH $letter
    WITH DISTINCT *
    ORDER BY ${sortBy}
    WITH CASE
      WHEN v IS NULL
        THEN null
      ELSE
        {
          id: v.id,
          name: v.name,
          city: v.city,
          country: { id: c.id, name: c.name, alpha2: c.alpha2 }
        }
      END AS venue
    WITH COLLECT(venue) AS all_venues
    WITH all_venues[toInteger($skip)..toInteger($skip) + 40] AS venues, SIZE(all_venues) AS count
    RETURN venues, count
    `,
    { letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: results.count.low,
    venues: results.venues
  }
})
