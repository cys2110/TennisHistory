export default defineEventHandler(async (query) => {
  const { name, city } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
        MATCH (:Venue {name: $name, city: $city})<-[:TOOK_PLACE_IN]-(e:Event)
        MATCH (y:Year)<-[:TOOK_PLACE_IN]-(e)-[:EDITION_OF]->(t:Tournament)
        WITH e, t, y
        ORDER BY e.start_date DESC
        RETURN COLLECT(DISTINCT {
        tid: toString(t.id),
        name: t.name,
        eid: toString(e.id),
        year: toString(y.id)
        }) AS events
            `,
    { name: name, city: city }
  );

  const events = records.map((record) => record.toObject());

  return events[0].events;
});
