export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})-[:EDITION_OF]->(t:Tournament)
      MATCH (p:Player)-[:ENTERED]->(f:Entry)
      WHERE f.id STARTS WITH $id
      OPTIONAL MATCH (f)-[:SCORED]->(s:Score)-[:SCORED]->(n:Best3|Best5)
      OPTIONAL MATCH (f)-[z:WITHDREW|Q_WITHDREW]->(:Event)
      OPTIONAL MATCH (s)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p1:Player)
      WHERE p.id <> p1.id
      CALL (p, e) {
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH (p)-[x:REPRESENTED]->(o:Country)
        RETURN
          CASE
            WHEN
              x IS NOT NULL AND
              x.start_date <= e.start_date AND
              x.end_date > e.start_date
              THEN apoc.any.properties(o)
            ELSE apoc.any.properties(c)
          END AS country
      }
      WITH
        t.name AS tournament,
        country,
        p,
        f,
        z,
        CASE
          WHEN f:Singles THEN 'Singles'
          ELSE 'Doubles'
        END AS type,
        CASE
          WHEN n:Main OR (z IS NOT NULL AND z:WITHDREW) THEN 'Main'
          ELSE 'Qualifying'
        END AS draw,
        CASE
          WHEN p:ATP THEN 'ATP'
          ELSE 'WTA'
        END AS tour,
        p1.id AS team_mate,
        CASE
          WHEN z IS NULL THEN false
          ELSE true
        END AS withdrawn,
        z.team_mate AS withdrawn_teammate
      ORDER BY f.rank
      RETURN DISTINCT
        tournament,
        apoc.map.mergeList(
          [
            apoc.any.properties(f),
            apoc.any.properties(p),
            {
              country: country,
              draw: draw,
              type: type,
              team_mate: CASE WHEN withdrawn_teammate IS NULL THEN team_mate ELSE withdrawn_teammate END,
              withdrawn: withdrawn,
              tour: tour
            }
          ]
        ) AS entry
    `,
    { id }
  )

  const entries = records.map(record => {
    const entry = record.get("entry")
    const numberKeys = ["rank", "seed", "q_seed"]

    for (const key of numberKeys) {
      if (entry[key]) {
        entry[key] = entry[key].toInt()
      }
    }

    return entry
  })

  return {
    tournament: records[0]?.get("tournament") ?? null,
    entries
  }
})
