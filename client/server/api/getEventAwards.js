export default defineEventHandler(async (query) => {
  const { eid } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (e:Event {id: $id})<-[:ROUND_OF]-(r:Round)
        RETURN COLLECT ({round: r.round, pm: r.pm, points: r.points, currency: e.currency}) AS rounds
    `,
    { id: parseInt(eid) }
  );

  const event = records.map((record) => record.toObject());

  return event[0].rounds;
});
