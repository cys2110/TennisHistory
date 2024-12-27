export default defineEventHandler(async (query) => {
  const { searchTerm } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        OPTIONAL MATCH (p:Player)-[:REPRESENTS]->(x:Country) WHERE p.first_name + ' ' + p.last_name =~ '(?i).*'+ $searchTerm + '.*'
        OPTIONAL MATCH (t:Tournament) WHERE t.name =~ '(?i).*' + $searchTerm + '.*'
        OPTIONAL MATCH (u:Umpire) WHERE u.id =~ '(?i).*' + $searchTerm + '.*'
        OPTIONAL MATCH (s:Supervisor) WHERE s.id =~ '(?i).*' + $searchTerm + '.*'
        OPTIONAL MATCH (o:Coach) WHERE o.id =~ '(?i).*' + $searchTerm + '.*' OR o.first_name + ' ' + o.last_name =~ '(?i).*'+ $searchTerm + '.*'
        OPTIONAL MATCH (c:Country) WHERE c.name =~ '(?i).*' + $searchTerm + '.*'
        OPTIONAL MATCH (v:Venue)-[:LOCATED_IN]->(y:Country) WHERE v.name =~ '(?i).*' + $searchTerm + '.*' OR v.city =~ '(?i).*' + $searchTerm + '.*'
        OPTIONAL MATCH (z:Surface) WHERE z.id =~ '(?i).*' + $searchTerm + '.*'
        WITH
        CASE WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT{id: p.id, name: p.first_name || ' ' || p.last_name, country: x.id}) ELSE [] END AS players,
        CASE WHEN COUNT(t) > 0 THEN COLLECT(DISTINCT{id: t.id, name: t.name}) ELSE [] END AS tournaments,
        CASE WHEN COUNT(u) > 0 THEN COLLECT(DISTINCT u.id) ELSE [] END AS umpires,
        CASE WHEN COUNT(s) > 0 THEN COLLECT(DISTINCT s.id) ELSE [] END AS supervisors,
        CASE WHEN COUNT(c) > 0 THEN COLLECT(DISTINCT{id: c.id, name: c.name}) ELSE [] END AS countries,
        CASE WHEN COUNT(z) > 0 THEN COLLECT(DISTINCT z.id) ELSE [] END AS surfaces,
        CASE WHEN COUNT(v) > 0 THEN COLLECT(DISTINCT {name: v.name, city: v.city, country: y.id}) ELSE [] END AS venues,
        CASE WHEN COUNT(o) > 0 THEN COLLECT(DISTINCT {id: o.id, name: CASE WHEN o.first_name IS NOT NULL THEN o.first_name || ' ' || o.last_name ELSE NULL END}) ELSE [] END AS coaches
        RETURN {
        Players: players,
        Surfaces: surfaces,
        Supervisors: supervisors,
        Umpires: umpires,
        Tournaments: tournaments,
        Countries: countries,
        Venues: venues,
        Coaches: coaches
        } as results
        `,
    { searchTerm }
  );

  const results = records.map((record) => record.toObject());

  return results[0].results;
});
