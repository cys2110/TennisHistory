export default defineEventHandler(async query => {
  const { id, label, relationship } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:${label} {id: $id})-[:${relationship}]-(e:Event)
      MATCH (y:Year)<-[:IN_YEAR]-(e)-[:EDITION_OF]->(t:Tournament)
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
