export default defineEventHandler(async (query) => {
  const { id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
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
      CALL (p) {
        OPTIONAL MATCH (p)<-[:COACHES]-(z:Coach)
        WITH CASE
          WHEN z IS NOT NULL THEN {id: z.id, name: z.first_name || ' ' || z.last_name}
          ELSE []
        END AS coach
        RETURN COLLECT(DISTINCT coach) AS coaches
      }
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
        countries: countries,
        age: CASE
          WHEN p.dod IS NOT NULL THEN toString(duration.between(p.dob, p.dod).years)
          ELSE toString(duration.between(p.dob, date()).years)
        END,
        dob: CASE
          WHEN p.dob IS NOT NULL THEN apoc.temporal.format(p.dob, 'EEEE dd MMMM YYYY')
          ELSE NULL
        END,
        hof: toString(p.hof),
        dod: CASE
          WHEN p.dod IS NOT NULL THEN apoc.temporal.format(p.dod, 'EEEE dd MMMM YYYY')
          ELSE NULL
        END
      } AS player
    `,
      { id }
  );

  const player = records.map((record) => record.toObject());

  return player[0].player;
});
