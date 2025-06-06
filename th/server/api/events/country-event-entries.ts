export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})
      MATCH (p:Player)-[:ENTERED]->(f:Entry) WHERE f.id STARTS WITH $id
      CALL (p, e) {
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(n:Country)
        RETURN CASE
          WHEN x IS NOT NULL AND x.start_date <= e.start_date AND x.end_date > e.start_date THEN {id: x.id, alpha2: x.alpha2, name: x.name}
          ELSE {id: c.id, alpha2: c.alpha2, name: c.name}
        END AS country
      }
      WITH p, f, country
        ORDER BY country.id, f.rank
      RETURN {
        id: p.id,
        name: p.first_name || ' ' || p.last_name,
        last: p.last_name,
        country: country,
        rank: toString(f.rank)
      } as entry
    `,
    { id }
  )

  const event = records.map(record => record.get("entry"))

  return event
})
