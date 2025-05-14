export default defineEventHandler(async query => {
  const { p1Id, p2Id } = getQuery(query)

  const { records: p1Details } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(y:Year)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t:Match)-[:PLAYED]->(:Round {round: 'Final'})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(w:Best3 | Best5)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(l:Best3 | Best5)
      WITH p, y, COUNT(DISTINCT(t)) AS titles, COUNT(DISTINCT(w)) AS wins, COUNT(DISTINCT(l)) AS losses
      RETURN {
        wins: toString(wins),
        losses: toString(losses),
        pm: apoc.number.format(p.pm, '#,###'),
        rh: p.rh,
        bh: p.bh,
        turned_pro: toString(y.id),
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
      OPTIONAL MATCH (p)-[:TURNED_PRO]->(y:Year)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(t:Match)-[:PLAYED]->(:Round {round: 'Final'})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Winner)-[:SCORED]->(w:Best3 | Best5)
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(:Loser)-[:SCORED]->(l:Best3 | Best5)
      WITH p, y, COUNT(DISTINCT(t)) AS titles, COUNT(DISTINCT(w)) AS wins, COUNT(DISTINCT(l)) AS losses
      RETURN {
        wins: toString(wins),
        losses: toString(losses),
        pm: apoc.number.format(p.pm, '#,###'),
        rh: p.rh,
        bh: p.bh,
        turned_pro: toString(y.id),
        titles: toString(titles),
        dob: apoc.temporal.format(p.dob, 'dd/MM/yy'),
        height: toString(p.height),
        ch: toString(p.ch)
      } AS p2
    `,
    { id: p2Id }
  )

  const { records: wl } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (:Player {id: $p1Id})-[:ENTERED]->(:Entry)-[:SCORED]->(s1:Winner)-[:SCORED]->(:Best3|Best5)<-[:SCORED]-(:Loser)<-[:SCORED]-(:Entry)<-[:ENTERED]-(:Player {id: $p2Id})
      OPTIONAL MATCH (:Player {id: $p2Id})-[:ENTERED]->(:Entry)-[:SCORED]->(s2:Winner)-[:SCORED]->(:Best3|Best5)<-[:SCORED]-(:Loser)<-[:SCORED]-(:Entry)<-[:ENTERED]-(:Player {id: $p1Id})
      RETURN toString(COUNT(DISTINCT s1)) AS p1, toString(COUNT(DISTINCT s2)) AS p2
    `,
    { p1Id, p2Id }
  )

  const p1 = p1Details[0].get("p1")
  const p2 = p2Details[0].get("p2")
  const p1Wins = wl[0].get("p1")
  const p2Wins = wl[0].get("p2")

  return {
    p1: {
      ...p1,
      height: Number(p1.height),
      wins: Number(p1.wins),
      losses: Number(p1.losses),
      titles: Number(p1.titles),
      ch: Number(p1.ch),
      turned_pro: p1.turned_pro ? Number(p1.turned_pro) : null,
      retired: p1.retired ? Number(p1.retired) : null
    },
    p2: {
      ...p2,
      height: Number(p2.height),
      wins: Number(p2.wins),
      losses: Number(p2.losses),
      titles: Number(p2.titles),
      ch: Number(p2.ch),
      turned_pro: p2.turned_pro ? Number(p2.turned_pro) : null,
      retired: p2.retired ? Number(p2.retired) : null
    },
    p1Wins: Number(p1Wins),
    p2Wins: Number(p2Wins)
  }
})
