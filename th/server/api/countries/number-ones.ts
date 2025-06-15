export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (country:Country {id: $id})
    CALL (country) {
      WITH country
      OPTIONAL MATCH (p1:Player {ch_singles: 1})-[:REPRESENTS]->(country)
      OPTIONAL MATCH (p1)-[:ENTERED]->(f:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Singles|Doubles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y1:Year)
      OPTIONAL MATCH (p2:Player {ch_singles: 1})-[t:REPRESENTED]->(country)
        WHERE p2.singles_ch_date >= t.start_date AND p2.singles_ch_date <= t.end_date
      OPTIONAL MATCH (p2)-[:REPRESENTS]->(sc:Country)
      OPTIONAL MATCH (p2)-[:ENTERED]->(f:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Singles|Doubles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y2:Year)
      WITH *, min(y1.id) AS p1_min, max(y1.id) AS p1_max, min(y2.id) AS p2_min, max(y2.id) AS p2_max
      WITH [
        CASE WHEN p1 IS NOT NULL THEN {
          tour: labels(p1),
          id: p1.id,
          name: p1.first_name + ' ' + p1.last_name,
          last_name: p1.last_name,
          singles_ch_date: apoc.temporal.format(p1.singles_ch_date, 'dd MMMM yyyy'),
          raw_date: p1.singles_ch_date,
          country: {id: country.id, name: country.name, alpha2: country.alpha2},
          min_year: p1_min,
          max_year: p1_max
        } END,
        CASE WHEN p2 IS NOT NULL THEN {
          tour: labels(p2),
          id: p2.id,
          name: p2.first_name + ' ' + p2.last_name,
          last_name: p2.last_name,
          singles_ch_date: apoc.temporal.format(p2.singles_ch_date, 'dd MMMM yyyy'),
          raw_date: p2.singles_ch_date,
          country: {id: sc.id, name: sc.name, alpha2: sc.alpha2},
          min_year: p2_min,
          max_year: p2_min
        } END
      ] AS raw_singles
      UNWIND raw_singles AS s
      WITH s WHERE s IS NOT NULL
      ORDER BY s.raw_date
      RETURN COLLECT(DISTINCT s) AS singles_players
    }
    CALL (country) {
      WITH country
      OPTIONAL MATCH (p3:Player {ch_doubles: 1})-[:REPRESENTS]->(country)
      OPTIONAL MATCH (p3)-[:ENTERED]->(f:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Singles|Doubles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y3:Year)
      OPTIONAL MATCH (p4:Player {ch_doubles: 1})-[t:REPRESENTED]->(country)
        WHERE p4.doubles_ch_date >= t.start_date AND p4.doubles_ch_date <= t.end_date
      OPTIONAL MATCH (p4)-[:REPRESENTS]->(dc:Country)
      OPTIONAL MATCH (p4)-[:ENTERED]->(f:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Singles|Doubles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y4:Year)
      WITH *, min(y3.id) AS p3_min, max(y3.id) AS p3_max, min(y4.id) AS p4_min, max(y4.id) AS p4_max
      WITH [
        CASE WHEN p3 IS NOT NULL THEN {
          tour: labels(p3),
          id: p3.id,
          name: p3.first_name + ' ' + p3.last_name,
          last_name: p3.last_name,
          doubles_ch_date: apoc.temporal.format(p3.doubles_ch_date, 'dd MMMM yyyy'),
          raw_date: p3.doubles_ch_date,
          country: {id: country.id, name: country.name, alpha2: country.alpha2},
          min_year: p3_min,
          max_year: p3_min
        } END,
        CASE WHEN p4 IS NOT NULL THEN {
          tour: labels(p4),
          id: p4.id,
          name: p4.first_name + ' ' + p4.last_name,
          last_name: p4.last_name,
          doubles_ch_date: apoc.temporal.format(p4.doubles_ch_date, 'dd MMMM yyyy'),
          raw_date: p4.doubles_ch_date,
          country: {id: dc.id, name: dc.name, alpha2: dc.alpha2},
          min_year: p4_min,
          max_year: p4_min
        } END
      ] AS raw_doubles
      UNWIND raw_doubles AS d
      WITH d WHERE d IS NOT NULL
      ORDER BY d.raw_date
      RETURN COLLECT(DISTINCT d) AS doubles_players
    }
    RETURN singles_players, doubles_players
    `,
    { id }
  )

  const singles = records[0].get("singles_players") || []
  const doubles = records[0].get("doubles_players") || []

  const singles_players = singles.map((s: any) => ({
    ...s,
    tour: s.tour.includes("ATP") ? "ATP" : "WTA",
    min_year: s.min_year.low,
    max_year: s.max_year.low
  }))

  const doubles_players = doubles.map((d: any) => ({
    ...d,
    tour: d.tour.includes("ATP") ? "ATP" : "WTA",
    min_year: d.min_year.low,
    max_year: d.max_year.low
  }))

  return {
    singles_players: singles_players.reduce((acc: any, player: any) => {
      if (!acc.find((p: any) => p.id === player.id)) acc.push(player)
      return acc
    }, []),
    doubles_players: doubles_players.reduce((acc: any, player: any) => {
      if (!acc.find((p: any) => p.id === player.id)) acc.push(player)
      return acc
    }, [])
  }
})
