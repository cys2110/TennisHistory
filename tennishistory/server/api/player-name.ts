export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH p.first_name || ' ' || p.last_name AS name, min(y.id) AS min, max(y.id) AS max
      RETURN {
        name: name,
        start: toString(min),
        end: toString(max)
      } AS player
    `,
    { id }
  )

  const results = records[0].toObject()

  return results.player
})
