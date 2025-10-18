export default defineEventHandler(async event => {
  interface QueryProps {
    name: string
    city: string
    country: CountryInterface
  }

  const { name, city, country } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Country {id: $country})
      MERGE (v:Venue {city: $city})
      ON CREATE SET v.id = CASE WHEN $name CONTAINS v.city THEN $name ELSE $name || ' ' || $city END
      MERGE (v)-[:LOCATED_IN]->(c)
      SET v.name = $name
      RETURN v
    `,
    {
      name,
      city,
      country: country.id
    }
  )

  return summary
})
