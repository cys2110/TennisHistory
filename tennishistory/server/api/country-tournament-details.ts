export default defineEventHandler(async query => {
  const { tid } = getQuery<{ tid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year)<-[:IN_YEAR]-(e:Event)-[:EDITION_OF]->(t:Tournament {id: $id})
      MATCH (x:Tie)-[:TIE_OF]->(r:Round {round: 'Final'})-[:ROUND_OF]->(e)
      WITH y, e, t, x
        ORDER BY y.id
        MATCH (c1:Country {alpha2: x.c1})
        MATCH (c2:Country {alpha2: x.c2})
      WITH {
        eid: toString(e.id),
        year: toString(y.id),
        c1: {id: c1.id, name: c1.name, alpha2: c1.alpha2},
        c2: {id: c2.id, name: c2.name, alpha2: c2.alpha2},
        score: x.score
      } AS event
      RETURN COLLECT(event) AS events
    `,
    { id: Number(tid) }
  )

  const results = records[0].toObject()

  return results.events
})
