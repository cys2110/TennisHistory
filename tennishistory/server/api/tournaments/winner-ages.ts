export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)<-[:ROUND_OF]-(:Round {round: 'Final'})<-[:PLAYED]-(:Match)<-[:SCORED]-(:Winner)<-[:SCORED]-(f:Entry)<-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
      MATCH (e)-[:IN_YEAR]->(y:Year)
      WITH p, y, e, c, duration.between(p.dob, e.end_date) AS age
      ORDER BY age

      RETURN {age: apoc.temporal.format(age, "y 'years,' M 'months,' d 'days'"), player: {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}}, year: toString(y.id)} AS winner
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.get("winner"))

  return results
})
