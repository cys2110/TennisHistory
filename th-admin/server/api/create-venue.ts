export default defineEventHandler(async event => {
  const { name, city, country } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Country {id: $country})
      MERGE (v:Venue {city: $city})
      ON CREATE SET v.id = CASE WHEN $name CONTAINS v.city THEN $nme ELSE $name || ' ' || $city END
      MERGE (v)-[:LOCATED_IN]->(c)
      SET v.name = $nme
      RETURN v
    `,
    {
      name,
      city,
      country
    }
  )

  return summary
})
