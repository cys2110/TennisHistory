export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  // TODO: Remove start date safeguard
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH
      (t:Tournament)<-[:EDITION_OF]-
      (e:Event)-[:TOOK_PLACE_IN]->
      (v:Venue)-[:LOCATED_IN]->
      (:Country {id: $id})
    WHERE e.start_date IS NOT NULL OR e.atp_start_date IS NOT NULL OR e.wta_start_date IS NOT NULL
    MATCH (e)-[:IN_YEAR]->(y:Year)
    WITH *, apoc.coll.min([e.start_date, e.atp_start_date, e.wta_start_date]) AS start_date
    ORDER BY start_date
    WITH COLLECT({id: v.id, name: v.name, city: v.city}) AS venues, e, y, t
    RETURN CASE WHEN e IS NOT NULL THEN
      {
        tours: labels(e),
        id: e.id,
        year: y.id,
        tournament: {id: t.id, name: t.name},
        venues: venues
      } ELSE null END AS event
    `,
    { id }
  )

  const results = records.map(record => record.get("event"))

  const events = results.filter(Boolean).map(event => ({
    ...event,
    tours: event.tours.filter((tour: string) => tour !== "Event"),
    id: event.id.low,
    year: event.year.low,
    tournament: {
      ...event.tournament,
      id: event.tournament.id.low
    }
  }))

  return events
})
