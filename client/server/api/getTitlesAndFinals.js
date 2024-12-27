export default defineEventHandler(async (query) => {
  const { pid } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
      MATCH (p:Player {id: $id})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (y:Year)<-[:TOOK_PLACE_IN]-(e)-[:ON_SURFACE]->(s:Surface)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(f:Event)-[:EDITION_OF]->(g:Tournament)
      OPTIONAL MATCH (i:Year)<-[:TOOK_PLACE_IN]-(f)-[:ON_SURFACE]->(h:Surface)
      WITH DISTINCT y, i, e, t, s, f, g, h
      ORDER BY e.start_date, f.start_date
      WITH
      CASE
        WHEN count(e) > 0 THEN COLLECT(DISTINCT({eid: toString(e.id), tid: toString(t.id), tname: t.name, year: toString(y.id), surface: s.id, date: apoc.temporal.format(e.end_date, 'dd MMMM YYYY'), year: y.id})) ELSE []
      END AS titles,
      CASE
        WHEN count(f) > 0 THEN COLLECT(DISTINCT({eid: toString(f.id), tid: toString(g.id), tname: g.name, year: toString(i.id), surface: h.id, date: apoc.temporal.format(f.end_date, 'dd MMMM YYYY'), year: i.id})) ELSE []
      END AS finals
      WITH titles, finals, apoc.map.groupByMulti(titles, "year") AS tc, apoc.map.groupByMulti(finals, "year") AS fc
      WITH titles, finals, [k IN keys(tc) | { year: k, count: toString(SIZE(tc[k])) }] AS ta, [k IN keys(fc) | { year: k, count: toString(SIZE(fc[k]))}] AS fa
      WITH titles, finals, apoc.coll.sortMaps(ta, '^year') AS titlesCount, apoc.coll.sortMaps(fa, '^year') AS finalsCount
      RETURN {
        titles: titles,
        finals: finals,
        titles_count: titlesCount,
        finals_count: finalsCount
      } AS result
        `,
    { id: pid }
  );

  const player = records.map((record) => record.toObject());

  return player[0].result;
});
