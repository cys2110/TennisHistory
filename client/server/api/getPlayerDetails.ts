export default defineEventHandler(async (query) => {
    const { id } = getQuery(query);

    const { records } = await useDriver().executeQuery(
        `/* cypher */
        MATCH (p:Player {id: $id})-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[:TURNED_PRO]->(tp:Year)
        OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
        OPTIONAL MATCH (p)<-[:COACHES]-(z:Coach)
        CALL (p) {
          OPTIONAL MATCH (p)-[t:REPRESENTED]->(fc:Country)
          WITH CASE
            WHEN fc IS NOT NULL THEN {
              id: fc.id,
              name: fc.name,
              dates: CASE
              WHEN t.start_date IS NULL OR t.end_date IS NULL THEN '—'
              WHEN t.start_date.year = t.end_date.year AND t.start_date.month = t.end_date.year THEN apoc.temporal.format(t.start_date, 'dd') || '-' || apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
              WHEN t.start_date.year = t.end_date.year THEN apoc.temporal.format(t.start_date, 'dd MMMM') || '-' || apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
              ELSE apoc.temporal.format(t.start_date, 'dd MMMM yyyy') || '-' || apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
            END
            }
            ELSE NULL
          END AS country
          RETURN COLLECT(DISTINCT country) AS countries
        }
        WITH p, c, COLLECT(z) AS coaches, countries, tp, r,
        CASE
          WHEN r.id IS NOT NULL AND tp.id IS NOT NULL THEN r.id - tp.id
          WHEN r.id IS NULL AND tp.id IS NOT NULL THEN date().year - tp.id
        ELSE NULL
        END AS active
        RETURN {
          ch: toString(p.career_high),
          ch_date: apoc.temporal.format(p.ch_date, 'dd MMMM YYYY'),
          wl: toString(p.win) || '-' || toString(p.loss),
          titles: toString(p.titles),
          pm: apoc.number.format(p.pm_USD, '#,###'),
          coaches: coaches,
          plays: p.rh,
          bh: p.bh1,
          height: p.height_cm,
          country_id: c.id,
          country_name: c.name,
          countries: countries,
          years_active: CASE
            WHEN tp.id IS NOT NULL AND r.id IS NULL THEN toString(tp.id) || '- present'
            WHEN tp.id IS NOT NULL AND r.id IS NOT NULL THEN toString(tp.id) || '-' || toString(r.id)
            ELSE NULL
          END,
          active_years: toString(active),
          age: toString(duration.between(p.dob, date()).years),
          dob: apoc.temporal.format(p.dob, 'EEEE dd MMMM YYYY'),
          gladiator: p.gladiator,
          hof: p.hof,
          dod: p.dod,
          name: p.first_name || ' ' || p.last_name
        } AS player
      `,
        { id }
    );

    const player = records.map((record) => record.toObject());

    return player[0].player;
});
