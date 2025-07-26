export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[z:REPRESENTS]->(c:Country)
      OPTIONAL MATCH
        (p)-[:ENTERED]->
        (:Entry)-[:SCORED]->
        (:Score)-[:SCORED]->
        (:Singles|Doubles)-[:PLAYED]->
        (:Round)-[:ROUND_OF]->
        (:Event)-[:IN_YEAR]->
        (y:Year)
      WITH *
      ORDER BY y.id
      RETURN
        apoc.map.merge(apoc.any.properties(c), apoc.any.properties(z)) AS country,
        COLLECT(DISTINCT (y.id)) AS years,
        [x IN labels(p) WHERE NOT x IN ['Update', 'Coach', 'Player']][0] AS tour,
        p.atp_link AS atp_link,
        p.wiki_link AS wiki_link,
        p.official_link AS official_link,
        p.wta_link AS wta_link,
        p.first_name AS first_name,
        p.last_name AS last_name,
        CASE WHEN 'Coach' IN labels(p) THEN true ELSE false END AS coach
    `,
    { id }
  )

  const results = records[0].toObject()
  if (results.country.start_date) {
    results.country.start_date = {
      day: results.country.start_date.day.toInt(),
      month: results.country.start_date.month.toInt(),
      year: results.country.start_date.year.toInt()
    }
  }

  return {
    ...results,
    years: results.years.map((year: any) => year.toInt())
  }
})
