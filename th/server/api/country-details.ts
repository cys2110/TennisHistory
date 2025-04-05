export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (c:Country {id: $id})<-[:REPRESENTS]-(p:Player)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y1:Year)
      OPTIONAL MATCH (c)<-[:REPRESENTED]-(q:Player)-[:REPRESENTS]->(d:Country)
      OPTIONAL MATCH (q)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y2:Year)
      OPTIONAL MATCH (c)<-[:LOCATED_IN]-(v:Venue)
      WITH c, p, q, d, v, COLLECT(DISTINCT y1.id) AS current_years, COLLECT(DISTINCT y2.id) AS former_years
        ORDER BY v.city, p.last_name, q.last_name
      WITH c, {id: p.id, name: p.first_name || ' ' || p.last_name, country: {id: c.id, name: c.name, alpha2: c.alpha2}, min_year: CASE WHEN current_years = [] THEN NULL ELSE toString(apoc.coll.min(current_years)) END, max_year: CASE WHEN current_years = [] THEN NULL ELSE toString(apoc.coll.max(current_years)) END} AS player,
        CASE WHEN q IS NOT NULL
          THEN {id: q.id, name: q.first_name || ' ' || q.last_name, country: {id: d.id, name: d.name, alpha2: d.alpha2}, min_year: CASE WHEN former_years = [] THEN NULL ELSE toString(apoc.coll.min(former_years)) END, max_year: CASE WHEN former_years = [] THEN NULL ELSE toString(apoc.coll.max(former_years)) END}
          ELSE NULL
        END AS former,
        CASE WHEN v IS NOT NULL
          THEN {name: v.name, city: v.city}
          ELSE NULL
        END AS venues
      RETURN COLLECT(DISTINCT player) AS current_players, {id: c.id, name: c.name, alpha2: c.alpha2} AS country, COLLECT(DISTINCT former) AS former_players, COLLECT(DISTINCT venues) AS venues
    `,
    { id }
  )

  const results = records[0].toObject()

  return results
})
