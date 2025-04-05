export default defineEventHandler(async query => {
  const { tid } = getQuery<{ tid: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (y:Year)<-[:IN_YEAR]-(e:Event)-[:EDITION_OF]->(t:Tournament {id: $id})
      MATCH (t)-[:ESTABLISHED]->(b:Year)
      OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
      MATCH (x:Tie)-[:TIE_OF]->(r:Round {round: 'Final'})-[:ROUND_OF]->(e)
      WITH y, e, t, x, b, a
        ORDER BY y.id
        MATCH (c1:Country {alpha2: x.c1})
        MATCH (c2:Country {alpha2: x.c2})
      RETURN DISTINCT {
        eid: toString(e.id),
        year: toString(y.id),
        c1: {id: c1.id, name: c1.name, alpha2: c1.alpha2},
        c2: {id: c2.id, name: c2.name, alpha2: c2.alpha2},
        score: x.score
      } AS event, t.website AS website, CASE
        WHEN a IS NULL THEN toString(b.id) || ' — present'
        WHEN b.id = a.id THEN toString(b.id)
        ELSE toString(e.id) || ' — ' || toString(b.id)
      END AS years
    `,
    { id: Number(tid) }
  )

  const results = records.map(record => record.get("event"))
  const years = records[0].get("years")
  const website = records[0].get("website")

  return { events: results, years, website }
})
