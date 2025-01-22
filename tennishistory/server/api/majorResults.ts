export default defineEventHandler(async (query) => {
  const { id } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      CALL(p) {
      MATCH (t:Tournament {id: 580})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(r:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(y:Year)
      WITH DISTINCT e, y, r, t, p
      WITH CASE
        WHEN COUNT(e) > 0 THEN COLLECT({eid: toString(e.id), year: toString(y.id)})
        ELSE NULL
      END AS events, t, p
      WITH {tname: 'Australian Open', tid: '580', round: 'Win', events: events} AS wins, t, p
      CALL(p, t) {
          OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(:Match)-[:PLAYED]->(z:Round)-[:ROUND_OF]->(f:Event)-[:EDITION_OF]->(t)
          OPTIONAL MATCH (f)-[:TOOK_PLACE_IN]->(v:Year)
          WITH DISTINCT z, f, v
          WITH CASE
            WHEN COUNT(f) > 0 THEN COLLECT({eid: toString(f.id), year: toString(v.id)})
            ELSE NULL
          END AS events, z
          RETURN apoc.agg.minItems({round: z.round, number: z.number, events: events}, z.number) AS lowestRound
      }
      RETURN CASE
          WHEN SIZE(wins.events) > 0 THEN wins
          WHEN SIZE(lowestRound.items) > 0 THEN {tname: 'Australian Open', tid: '580', round: lowestRound.items[0].round, events: apoc.coll.flatten([x IN lowestRound.items | x.events])}
          ELSE NULL
      END AS ao
      }
      CALL(p) {
      MATCH (t:Tournament {id: 520})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(r:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]-(y:Year)
      WITH DISTINCT e, y, r, t, p
      WITH CASE
        WHEN COUNT(e) > 0 THEN COLLECT({eid: toString(e.id), year: toString(y.id)})
        ELSE NULL
      END AS events, t, p
      WITH {tname: 'Roland Garros', tid: '520', round: 'Win', events: events} AS wins, t, p
      CALL(p, t) {
          OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(:Match)-[:PLAYED]->(z:Round)-[:ROUND_OF]->(f:Event)-[:EDITION_OF]->(t)
          OPTIONAL MATCH (f)-[:TOOK_PLACE_IN]->(v:Year)
          WITH DISTINCT z, f, v
          WITH CASE
            WHEN COUNT(f) > 0 THEN COLLECT({eid: toString(f.id), year: toString(v.id)})
            ELSE NULL
          END AS events, z
          RETURN apoc.agg.minItems({round: z.round, number: z.number, events: events}, z.number) AS lowestRound
      }
      RETURN CASE
          WHEN SIZE(wins.events) > 0 THEN wins
          WHEN SIZE(lowestRound.items) > 0 THEN {tname: 'Roland Garros', tid: '520', round: lowestRound.items[0].round, events: apoc.coll.flatten([x IN lowestRound.items | x.events])}
          ELSE NULL
      END AS rg
      }
      CALL(p) {
      MATCH (t:Tournament {id: 540})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(r:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]-(y:Year)
      WITH DISTINCT e, y, r, t, p
      WITH CASE
        WHEN COUNT(e) > 0 THEN COLLECT({eid: toString(e.id), year: toString(y.id)})
        ELSE NULL
      END AS events, t, p
      WITH {tname: 'Wimbledon', tid: '540', round: 'Win', events: events} AS wins, t, p
      CALL(p, t) {
          OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(:Match)-[:PLAYED]->(z:Round)-[:ROUND_OF]->(f:Event)-[:EDITION_OF]->(t)
          OPTIONAL MATCH (f)-[:TOOK_PLACE_IN]->(v:Year)
          WITH DISTINCT z, f, v
          WITH CASE
            WHEN COUNT(f) > 0 THEN COLLECT({eid: toString(f.id), year: toString(v.id)})
            ELSE NULL
          END AS events, z
          RETURN apoc.agg.minItems({round: z.round, number: z.number, events: events}, z.number) AS lowestRound
      }
      RETURN CASE
          WHEN SIZE(wins.events) > 0 THEN wins
          WHEN SIZE(lowestRound.items) > 0 THEN {tname: 'Wimbledon', tid: '540', round: lowestRound.items[0].round, events: apoc.coll.flatten([x IN lowestRound.items | x.events])}
          ELSE NULL
      END AS wimbledon
      }
      CALL(p) {
      MATCH (t:Tournament {id: 560})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(r:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]-(y:Year)
      WITH DISTINCT e, y, r, t, p
      WITH CASE
        WHEN COUNT(e) > 0 THEN COLLECT({eid: toString(e.id), year: toString(y.id)})
        ELSE NULL
      END AS events, t, p
      WITH {tname: 'US Open', tid: '560', round: 'Win', events: events} AS wins, t, p
      CALL(p, t) {
          OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(:Match)-[:PLAYED]->(z:Round)-[:ROUND_OF]->(f:Event)-[:EDITION_OF]->(t)
          OPTIONAL MATCH (f)-[:TOOK_PLACE_IN]->(v:Year)
          WITH DISTINCT z, f, v
          WITH CASE WHEN COUNT(f) > 0 THEN COLLECT({eid: toString(f.id), year: toString(v.id)}) ELSE NULL END AS events, z
          RETURN apoc.agg.minItems({round: z.round, number: z.number, events: events}, z.number) AS lowestRound
      }
      RETURN CASE
          WHEN SIZE(wins.events) > 0 THEN wins
          WHEN SIZE(lowestRound.items) > 0 THEN {tname: 'US Open', tid: '560', round: lowestRound.items[0].round, events: apoc.coll.flatten([x IN lowestRound.items | x.events])}
          ELSE NULL
      END AS uso
      }
      RETURN [ao, rg, wimbledon, uso] AS results
    `, { id }
  );

  const player = records.map((record) => record.toObject());

  return player[0].results;
});
