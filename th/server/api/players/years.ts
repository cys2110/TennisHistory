export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH y, p
      ORDER BY y.id
      RETURN COLLECT(DISTINCT toString(y.id)) AS years, labels(p) AS labels, p.atp_link AS atp_link, p.wiki_link AS wiki_link
    `,
    { id }
  )

  const results = records[0].toObject()

  return results
})
