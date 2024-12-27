export default defineEventHandler(async (query) => {
  const { pid } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (p:Player {id: $id})-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[:TURNED_PRO]->(tp:Year)
        OPTIONAL MATCH (p)-[:RETIRED]->(r:Year)
        OPTIONAL MATCH (p)-[t:REPRESENTED]->(fc:Country)
        OPTIONAL MATCH (p)<-[:COACHES]-(z:Coach)
        WITH p, c, COLLECT(z) AS coaches, tp, r,
        COLLECT(
          CASE WHEN fc IS NOT NULL
            THEN {
              id: fc.id,
              name: fc.name,
              dates: CASE
                WHEN t.start_date.year = t.end_date.year AND t.start_date.month = t.end_date.month THEN apoc.temporal.format(t.start_date, 'dd') || ' - ' || apoc.temporal.format(t.end_date, 'dd MMMM YYYY')
                WHEN t.start_date.year = t.end_date.year THEN apoc.temporal.format(t.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(t.end_date, 'dd MMMM YYYY')
                WHEN t.start_date.year <> t.end_date.year THEN apoc.temporal.format(t.start_date, 'dd MMMM YYYY') || ' - ' || apoc.temporal.format(t.end_date, 'dd MMMM YYYY')
                ELSE NULL
              END
            }
            ELSE NULL
          END
        ) AS countries,
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
          gladiator: p.gladiator
        } AS player
      `,
    { id: pid }
  );

  const player = records.map((record) => record.toObject());

  return player[0].player;
});
