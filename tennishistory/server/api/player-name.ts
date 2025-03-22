export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH p.first_name || ' ' || p.last_name AS name, min(y.id) AS min, max(y.id) AS max
      RETURN name AS name, toString(min) AS start, toString(max) AS end
    `,
    { id }
  )

  const start = records[0].get("start")
  const end = records[0].get("end")
  const name = records[0].get("name")

  return {
    name,
    start: Number(start),
    end: Number(end)
  }
})
