export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:REPRESENTS]->(c:Country)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Singles|Doubles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year)
      WITH *
      ORDER BY y.id
      RETURN
        properties(c) AS country,
        COLLECT(DISTINCT(y.id)) AS years,
        labels(p) AS tour, p.atp_link AS atp_link, p.wiki_link AS wiki_link, p.official_link AS official_link, p.wta_link AS wta_link, p.first_name as first_name, p.last_name AS last_name
    `,
    { id }
  )

  const results = records[0].toObject()

  return {
    ...results,
    tour: results.tour.includes("ATP") ? "ATP" : "WTA",
    coach: results.tour.includes("Coach"),
    years: results.years.map((y: any) => y.toInt())
  }
})
