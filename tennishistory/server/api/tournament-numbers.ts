export default defineEventHandler(async query => {
  const { tid } = getQuery<{ tid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)-[:IN_YEAR]->(y:Year)
      MATCH (e)-[:ON_SURFACE]->(s:Surface)
      MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      MATCH (e)<-[:ROUND_OF]-(r:Round)
      WITH t, e, y, s, v, c, r
        ORDER BY y.id, r.number
      WITH t, e, y, s, {name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}} AS venue, COLLECT({round: r.round, pm: r.pm}) AS rounds
      WITH {
        year: toString(y.id),
        ename: e.sponsor_name,
        surface: s.id,
        currency: e.currency,
        rounds: rounds,
        venue: venue,
        category: e.category
      } AS event
      RETURN COLLECT(event) AS events
    `,
    { id: Number(tid) }
  )

  const results = records[0].toObject()

  return results.events
})
