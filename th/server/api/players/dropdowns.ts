export default defineEventHandler(async event => {
  const { records: coachRecords } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (c:Coach WHERE c.first_name IS NOT NULL)
    RETURN apoc.map.submap(c, ['id', 'first_name', 'last_name'], null, false) AS coach
    ORDER BY coach.last_name, coach.first_name
    `
  )

  const { records: playerRecords } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (p:Player)-[:REPRESENTS]->(c:Country)
    WITH *
    ORDER BY p.last_name, p.first_name
    RETURN COLLECT(DISTINCT properties(c)) AS countries, COLLECT(apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false)) AS players
    `
  )

  return {
    coaches: coachRecords.map(r => r.get("coach")).filter(Boolean),
    countries: playerRecords[0]?.get("countries").sort((a: any, b: any) => a.name.localeCompare(b.name)) || [],
    players: playerRecords[0]?.get("players").filter(Boolean) || []
  }
})
