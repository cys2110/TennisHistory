export default defineEventHandler(async event => {
  const { search } = getQuery(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (v:Venue)-[:LOCATED_IN]->(c:Country) WHERE v.id =~ '(?i).*' + $search + '.*'
      WITH v, CASE WHEN v.name IS NOT NULL THEN v.name || ', ' || v.city || ', ' || c.name ELSE v.city || ', ' || c.name END AS label
      RETURN { id: v.id, label: label } AS venue
      ORDER BY venue.id
      LIMIT 40
    `,
    {
      search
    }
  )

  const results = records.map(record => record.get("venue"))

  return results
})
