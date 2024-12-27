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
          THEN {id: fc.id, start: apoc.temporal.format(t.start_date, 'dd MMMM YYYY'), end: apoc.temporal.format(t.end_date, 'dd MMMM YYYY')}
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
          win: toString(p.win),
          loss: toString(p.loss),
          titles: toString(p.titles),
          pm: p.pm_USD,
          coaches: coaches,
          plays: p.rh,
          bh: p.bh1,
          height: p.height_cm,
          country: c.id,
          countries: countries,
          pro: toString(tp.id),
          retired: toString(r.id),
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
