export default defineEventHandler(async (query) => {
  const { id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:TOOK_PLACE_IN]->(y:Year)
      RETURN {start: min(y.id), end: max(y.id)} AS years
    `, { id }
  );

  const player = records.map((record) => record.toObject());

  return player[0].years;
});
