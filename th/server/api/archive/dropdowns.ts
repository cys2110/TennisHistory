export default defineEventHandler(async event => {
  const { records: tournamentRecords } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (t:Tournament)
    RETURN DISTINCT t.name AS tournament
    ORDER BY tournament
    `
  )

  const { records: categoryRecords } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (e:Event)
    WITH apoc.coll.toSet(apoc.coll.flatten(COLLECT([e.category, e.atp_category, e.wta_category, e.men_category, e.women_category]))) AS categories
    UNWIND categories AS category
    RETURN category
    ORDER BY category
    `
  )

  const { records: venueRecords } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (v:Venue)-[:LOCATED_IN]->(c:Country)
    WITH *
    ORDER BY v.city, v.name
    WITH COLLECT(DISTINCT properties(c)) AS countries, COLLECT(DISTINCT properties(v)) AS venue
    RETURN countries, venue
    `
  )

  const { records: supervisorRecords } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (s:Supervisor)
    RETURN DISTINCT properties(s) AS supervisor
    ORDER BY supervisor.last_name, supervisor.first_name
    `
  )

  const { records: umpireRecords } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (u:Umpire)
    RETURN DISTINCT properties(u) AS umpire
    ORDER BY umpire.last_name, umpire.first_name
    `
  )

  return {
    tournaments: tournamentRecords.map(r => r.get("tournament")).filter(Boolean),
    categories: categoryRecords.map(r => r.get("category")).filter(Boolean),
    venues: venueRecords[0]?.get("venue") || [],
    countries: venueRecords[0]?.get("countries").sort((a: any, b: any) => a.name.localeCompare(b.name)) || [],
    supervisors: supervisorRecords.map(r => r.get("supervisor")).filter(Boolean),
    umpires: umpireRecords.map(r => r.get("umpire")).filter(Boolean)
  }
})
