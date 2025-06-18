export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    WITH ['Grand Slam', 'ATP Masters 1000', 'ATP Masters Series', 'ATP Super 9', 'ATP Championship Series, Single Week', 'Premier Mandatory', 'WTA 1000', 'Olympics', 'ATP Finals', 'WTA Finals'] AS categories
    MATCH (c:Country {id: $id})
    CALL (c, categories) {
      OPTIONAL MATCH(c)<-[z:REPRESENTS | REPRESENTED]-(p:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Singles)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year)
      WHERE (e.category IN categories OR e.atp_category IN categories OR e.wta_category IN categories) AND (z.start_date IS NULL OR (e.start_date >= z.start_date AND e.start_date <= z.end_date))
      OPTIONAL MATCH (e)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (p)-[:REPRESENTS]->(c1)
      CALL (p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Singles|Doubles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y2:Year)
        RETURN min(y2.id) AS min_year, max(y2.id) AS max_year
      }
      WITH *
      ORDER BY p.last_name, y.id
      WITH CASE WHEN t IS NULL THEN NULL ELSE {id: e.id, tournament: {id: t.id, name: t.name}, year: y.id, category: e.category, wta_category: e.wta_category, atp_category: e.atp_category, tours: labels(e)} END AS tournament, p, c1, min_year, max_year
      WITH COLLECT(DISTINCT tournament) AS tournaments, p, c1, min_year, max_year
      WITH CASE WHEN p IS NULL THEN NULL ELSE {tour: labels(p), id: p.id, name: p.first_name || ' ' || p.last_name, last_name: p.last_name, country: {id: c1.id, name: c1.name, alpha2: c1.alpha2}, tournaments: tournaments, min_year: min_year, max_year: max_year} END AS player
      WITH COLLECT(player) AS raw_singles
      RETURN [player IN raw_singles WHERE player IS NOT NULL] AS singles_players
    }
    CALL (c, categories) {
      OPTIONAL MATCH(c)<-[z:REPRESENTS | REPRESENTED]-(p:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Doubles)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year)
      WHERE (e.category IN categories OR e.atp_category IN categories OR e.wta_category IN categories) AND (z.start_date IS NULL OR (e.start_date >= z.start_date AND e.start_date <= z.end_date))
      OPTIONAL MATCH (e)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (p)-[:REPRESENTS]->(c1)
      CALL (p) {
        OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Singles|Doubles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y2:Year)
        RETURN min(y2.id) AS min_year, max(y2.id) AS max_year
      }
      WITH *
      ORDER BY p.last_name, y.id
      WITH CASE WHEN t IS NULL THEN NULL ELSE {id: e.id, tournament: {id: t.id, name: t.name}, year: y.id, category: e.category, wta_category: e.wta_category, atp_category: e.atp_category, tours: labels(e)} END AS tournament, p, c1, min_year, max_year
      WITH COLLECT(DISTINCT tournament) AS tournaments, p, c1, min_year, max_year
      WITH CASE WHEN p IS NULL THEN NULL ELSE {tour: labels(p), id: p.id, name: p.first_name || ' ' || p.last_name, last_name: p.last_name, country: {id: c1.id, name: c1.name, alpha2: c1.alpha2}, tournaments: tournaments, min_year: min_year, max_year: max_year} END AS player
      WITH COLLECT(player) AS raw_doubles
      RETURN [player IN raw_doubles WHERE player IS NOT NULL] AS doubles_players
    }
    RETURN singles_players, doubles_players
    `,
    { id }
  )

  const results = records[0].toObject()

  const players = {
    singles_players: results.singles_players.map((s: any) => ({
      id: s.id,
      name: s.name,
      last_name: s.last_name,
      country: s.country,
      min_year: s.min_year?.low || 0,
      max_year: s.max_year?.low || 0,
      tour: s.tour.includes("ATP") ? "ATP" : "WTA",
      gs: s.tournaments
        .filter((t: any) => t.category === "Grand Slam")
        .map((t: any) => ({
          ...t,
          tours: t.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
          id: t.id.low,
          year: t.year.low,
          tournament: {
            ...t.tournament,
            id: t.tournament.id.low
          }
        })),
      olympics: s.tournaments
        .filter((t: any) => t.category === "Olympics")
        .map((t: any) => ({
          ...t,
          tours: t.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
          id: t.id.low,
          year: t.year.low,
          tournament: {
            ...t.tournament,
            id: t.tournament.id.low
          }
        })),
      finals: s.tournaments
        .filter((t: any) => t.category === "ATP Finals" || t.category === "WTA Finals")
        .map((t: any) => ({
          ...t,
          tours: t.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
          id: t.id.low,
          year: t.year.low,
          tournament: {
            ...t.tournament,
            id: t.tournament.id.low
          }
        })),
      a1000: s.tournaments
        .filter((t: any) => !["Grand Slam", "Olympics", "ATP Finals", "WTA Finals"].includes(t.category))
        .map((t: any) => ({
          ...t,
          tours: t.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
          id: t.id.low,
          year: t.year.low,
          tournament: {
            ...t.tournament,
            id: t.tournament.id.low
          }
        }))
    })),
    doubles_players: results.doubles_players.map((d: any) => ({
      id: d.id,
      name: d.name,
      last_name: d.last_name,
      country: d.country,
      min_year: d.min_year?.low || 0,
      max_year: d.max_year?.low || 0,
      tour: d.tour.includes("ATP") ? "ATP" : "WTA",
      gs: d.tournaments
        .filter((t: any) => t.category === "Grand Slam")
        .map((t: any) => ({
          ...t,
          tours: t.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
          id: t.id.low,
          year: t.year.low,
          tournament: {
            ...t.tournament,
            id: t.tournament.id.low
          }
        })),
      olympics: d.tournaments
        .filter((t: any) => t.category === "Olympics")
        .map((t: any) => ({
          ...t,
          tours: t.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
          id: t.id.low,
          year: t.year.low,
          tournament: {
            ...t.tournament,
            id: t.tournament.id.low
          }
        })),
      finals: d.tournaments
        .filter((t: any) => t.category === "ATP Finals" || t.category === "WTA Finals")
        .map((t: any) => ({
          ...t,
          tours: t.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
          id: t.id.low,
          year: t.year.low,
          tournament: {
            ...t.tournament,
            id: t.tournament.id.low
          }
        })),
      a1000: d.tournaments
        .filter((t: any) => !["Grand Slam", "Olympics", "ATP Finals", "WTA Finals"].includes(t.category))
        .map((t: any) => ({
          ...t,
          tours: t.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
          id: t.id.low,
          year: t.year.low,
          tournament: {
            ...t.tournament,
            id: t.tournament.id.low
          }
        }))
    }))
  }

  return players
})
