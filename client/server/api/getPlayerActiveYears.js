export default defineEventHandler(async (query) => {
  const { pid } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:TOOK_PLACE_IN]->(y:Year)
        RETURN {start: min(y.id), end: max(y.id)} AS years
    `,
    { id: pid }
  );

  const player = records.map((record) => record.toObject());

  return player[0].years;
});
