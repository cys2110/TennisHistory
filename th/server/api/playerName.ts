export default defineEventHandler(async (query) => {
  const { id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH min(y.id) AS min, max(y.id) AS max, p.first_name || ' ' || p.last_name AS name
      RETURN {
        name: name,
        start: toString(min),
        end: toString(max)
      } AS player
    `, { id }
  )

  const player = records.map((record) => record.toObject());

  return player[0].player;
})
