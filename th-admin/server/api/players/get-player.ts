export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      OPTIONAL MATCH (p)-[:REPRESENTS]->(c:Country)
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(tp:Year)
      OPTIONAL MATCH (p)-[:RETIRED]->(ret:Year)
      OPTIONAL MATCH (p)-[:REPRESENTED]->(c1:Country)
      OPTIONAL MATCH (x:Coach)-[:COACHES]->(p)
      OPTIONAL MATCH (x1:Coach)-[:COACHED]->(p)
      WITH p, c, tp, ret, COLLECT(DISTINCT properties(c1)) AS previous_countries, COLLECT(DISTINCT apoc.map.submap(x, ['id', 'first_name', 'last_name'], null, false)) AS coaches, COLLECT(DISTINCT apoc.map.submap(x1, ['id', 'first_name', 'last_name'], null, false)) AS former_coaches
      RETURN [x IN labels(p) WHERE NOT x IN ['Player', 'Coach']] AS tours, properties(c) AS country, properties(p) AS player, tp.id AS turned_pro, ret.id AS retired, previous_countries, coaches, former_coaches
    `,
    { id }
  )

  const result = records[0].toObject()

  return {
    tours: result.tours,
    country: result.country,
    previous_countries: result.previous_countries,
    turned_pro: result.turned_pro?.toInt() || undefined,
    retired: result.retired?.toInt() || undefined,
    coaches: result.coaches,
    former_coaches: result.former_coaches,
    id: result.player.id,
    first_name: result.player.first_name,
    last_name: result.player.last_name,
    atp_link: result.player.atp_link || undefined,
    wta_link: result.player.wta_link || undefined,
    wiki_link: result.player.wiki_link || undefined,
    bh: result.player.bh || undefined,
    rh: result.player.rh || undefined,
    current_singles: result.player.current_singles?.toInt() || undefined,
    current_doubles: result.player.current_doubles?.toInt() || undefined,
    ch_singles: result.player.ch_singles?.toInt() || undefined,
    ch_doubles: result.player.ch_doubles?.toInt() || undefined,
    singles_ch_date: result.player.singles_ch_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    doubles_ch_date: result.player.doubles_ch_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    dob: result.player.dob?.toStandardDate().toISOString().slice(0, 10) || undefined,
    dod: result.player.dod?.toStandardDate().toISOString().slice(0, 10) || undefined,
    height: result.player.height?.toInt() || undefined,
    official_link: result.player.official_link || undefined,
    pm: result.player.pm?.toNumber() || undefined,
    hof: result.player.hof?.toInt() || undefined,
    updated_at: result.player.updated_at?.toStandardDate().toISOString().slice(0, 10) || undefined
  }
})
