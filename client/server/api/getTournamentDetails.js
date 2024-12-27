export default defineEventHandler(async (event) => {
  const { tid } = getQuery(event);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (y:Year)<-[:ESTABLISHED]-(t:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)<-[:ROUND_OF]-(:Round {round: 'Final'})<-[:PLAYED]-(m:Match)<-[:SCORED]-(w:Winner)-[:SCORED]-(:Entry)<-[:ENTERED]-(winner:Player)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
        MATCH (e)-[:TOOK_PLACE_IN]->(ey:Year)
        OPTIONAL MATCH (m)<-[:SCORED]-(l:Loser)-[:SCORED]-(:Entry)<-[:ENTERED]-(loser:Player)-[:REPRESENTS]->(d:Country)
        WITH y, e, t, a, winner, loser, c, d, w, l, ey, m
        ORDER BY e.start_date
        WITH y, t, a, collect({
        eid: e.id,
        match_no: m.match_no,
        winner_name: winner.first_name + ' ' + winner.last_name,
        winner_id: winner.id,
        winner_country: c.id,
        loser_name: loser.first_name + ' ' + loser.last_name,
        loser_id: loser.id,
        loser_country: d.id,
        year: ey.id,
        s1: trim(coalesce(toString(w.s1), '') + coalesce(toString(l.s1), '')),
        s2: trim(coalesce(toString(w.s2), '') + coalesce(toString(l.s2), '')),
        s3: trim(coalesce(toString(w.s3), '') + coalesce(toString(l.s3), '')),
        s4: trim(coalesce(toString(w.s4), '') + coalesce(toString(l.s4), '')),
        s5: trim(coalesce(toString(w.s5), '') + coalesce(toString(l.s5), '')),
        t1: CASE
            WHEN w.t1 IS NOT NULL THEN apoc.coll.min([w.t1, l.t1])
            ELSE NULL
        END,
        t2: CASE
            WHEN w.t2 IS NOT NULL THEN apoc.coll.min([w.t2, l.t2])
            ELSE NULL
        END,
        t3: CASE
            WHEN w.t3 IS NOT NULL THEN apoc.coll.min([w.t3, l.t3])
            ELSE NULL
        END,
        t4: CASE
            WHEN w.t4 IS NOT NULL THEN apoc.coll.min([w.t4, l.t4])
            ELSE NULL
        END,
        t5: CASE
            WHEN w.t5 IS NOT NULL THEN apoc.coll.min([w.t5, l.t5])
            ELSE NULL
        END
        }) as events
        RETURN {website: t.website, established: y.id, abolished: a.id, events: events} as tournament
    `,
    { id: parseInt(tid) }
  );

  const tournament = records.map((record) => record.toObject());

  return tournament[0].tournament;
});
