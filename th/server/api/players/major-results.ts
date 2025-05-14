export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      WITH [580, 520, 540, 560, 605] AS tournaments
      MATCH (p:Player {id: $id})
      UNWIND tournaments AS tournament
      MATCH (t:Tournament {id: tournament})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(:Match)-[:PLAYED]->(r:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t)
      OPTIONAL MATCH (e)-[:IN_YEAR]->(y:Year)
      WITH DISTINCT e, y, r, t, p
      WITH CASE
        WHEN COUNT(e) > 0 THEN COLLECT({id: toString(e.id), year: toString(y.id)})
        ELSE NULL
      END AS events, t, p
      WITH {tournament: {name: t.name, id: toString(t.id)}, round: 'Win', events: events} AS wins, p, t
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(:Match)-[:PLAYED]->(z:Round)-[:ROUND_OF]->(f:Event)-[:EDITION_OF]->(t)
      OPTIONAL MATCH (f)-[:IN_YEAR]->(v:Year)
      WITH DISTINCT z, f, v, wins, t
      WITH CASE
        WHEN COUNT(f) > 0 THEN COLLECT({id: toString(f.id), year: toString(v.id)})
        ELSE NULL
      END AS events, z, wins, t
      WITH apoc.agg.minItems({round: z.round, number: z.number, events: events}, z.number) AS lowestRound, wins, t
      WITH CASE
        WHEN SIZE(wins.events) > 0 THEN wins
        WHEN SIZE(lowestRound.items) > 0 THEN {tournament: {name: t.name, id: toString(t.id)}, round: lowestRound.items[0].round, events: apoc.coll.flatten([x IN lowestRound.items | x.events])}
        ELSE NULL
      END AS events
      RETURN COLLECT(events) AS results
    `,
    { id }
  )

  const player = records[0].get("results")

  return player
})
