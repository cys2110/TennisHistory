export default defineEventHandler(async query => {
  const { year } = getQuery<{ year: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament)<-[:EDITION_OF]-(e:Event)-[:IN_YEAR]->(:Year {id: toInteger($year)})
      RETURN {name: t.name, id: e.id} AS event
    `,
    { year }
  )

  const events = records.map(r => {
    const event = r.get("event")

    return {
      name: event.name,
      id: event.id.toInt()
    }
  })

  return events
})
