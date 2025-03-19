export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Venue {id: $id})<-[:TOOK_PLACE_IN]-(e:Event)
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
    { id }
  )

  const events = records[0].toObject()

  return events.events
})
