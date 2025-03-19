export default defineEventHandler(async query => {
  const { p1Id, p2Id } = getQuery(query)

  const { records: p1Details } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      MATCH (p)-[:REPRESENTS]->(c)
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(y:Year)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t:Match)-[:PLAYED]->(:Round {round: 'Final'})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(w:Best3 | Best5)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(l:Best3 | Best5)
      WITH p, y, c, COUNT(DISTINCT(t)) AS titles, COUNT(DISTINCT(w)) AS wins, COUNT(DISTINCT(l)) AS losses
      RETURN {
        name: p.first_name || ' ' || p.last_name,
        wins: toString(wins),
        losses: toString(losses),
        pm: apoc.number.format(p.pm, '#,###'),
        rh: p.rh,
        bh: p.bh,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        pro: toString(y.id),
        titles: toString(titles),
        dob: apoc.temporal.format(p.dob, 'dd/MM/yy'),
        height: toString(p.height),
        ch: toString(p.ch)
      } As p1
    `,
    { id: p1Id }
  )

  const { records: p2Details } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      MATCH (p)-[:REPRESENTS]->(c)
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(y:Year)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t:Match)-[:PLAYED]->(:Round {round: 'Final'})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(w:Best3 | Best5)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(l:Best3 | Best5)
      WITH p, y, c, COUNT(DISTINCT(t)) AS titles, COUNT(DISTINCT(w)) AS wins, COUNT(DISTINCT(l)) AS losses
      RETURN {
        name: p.first_name || ' ' || p.last_name,
        wins: toString(wins),
        losses: toString(losses),
        pm: apoc.number.format(p.pm, '#,###'),
        rh: p.rh,
        bh: p.bh,
        country: {
          id: c.id,
          name: c.name,
          alpha2: c.alpha2
        },
        pro: toString(y.id),
        titles: toString(titles),
        dob: apoc.temporal.format(p.dob, 'dd/MM/yy'),
        height: toString(p.height),
        ch: toString(p.ch)
      } AS p2
    `,
    { id: p2Id }
  )

  const p1 = p1Details[0].toObject()
  const p2 = p2Details[0].toObject()

  return { p1: p1.p1, p2: p2.p2 }
})
