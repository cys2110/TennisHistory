export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})
      MATCH (p:Player)-[:ENTERED]->(f:Entry)
      WHERE f.id STARTS WITH $id
      OPTIONAL MATCH (f)-[:SCORED]->(s:Score)-[:SCORED]->(n:Match)
      OPTIONAL MATCH (f)-[x:WITHDREW|Q_WITHDREW]->(:Event)
      OPTIONAL MATCH (s)<-[:SCORED]-(:Entry)<-[:ENTERED]-(p1:Player)
      WHERE p.id <> p1.id
      CALL (p, e) {
        MATCH (p)-[:REPRESENTS]->(c:Country)
        OPTIONAL MATCH
          (p)-
            [z:REPRESENTED WHERE
              (z.start_date <= e.start_date OR
                ('ATP' IN labels(p) AND
                  z.start_date <= coalesce(e.atp_start_date, e.men_start_date)) OR
                ('WTA') IN labels(p) AND
                z.start_date <= coalesce(e.wta_start_date, e.women_start_date)) AND
              (z.end_date > e.start_date OR
                ('ATP' IN labels(p) AND
                  z.end_date > coalesce(e.atp_start_date, e.men_start_date) OR
                  ('WTA' IN labels(p) AND
                    z.end_date > coalesce(e.wta_start_date, e.women_start_date))))]->
          (o:Country)
        RETURN
          CASE
            WHEN z IS NULL THEN properties(c)
            ELSE properties(o)
          END AS country
      }
      WITH
        country,
        p,
        f,
        x,
        CASE
          WHEN f:Singles THEN 'Singles'
          ELSE 'Doubles'
        END AS type,
        CASE
          WHEN n:Main OR (x IS NOT NULL AND x:WITHDREW) THEN 'Main'
          ELSE 'Qualifying'
        END AS draw,
        CASE
          WHEN p:ATP THEN 'ATP'
          ELSE 'WTA'
        END AS tour,
        p1.id AS team_mate,
        CASE
          WHEN x IS NULL THEN false
          ELSE true
        END AS withdrawn,
        x.team_mate AS withdrawn_teammate
      ORDER BY f.rank
      RETURN DISTINCT
        apoc.map.mergeList([
          properties(f),
          properties(p),
          {
            country: country,
            draw: draw,
            type: type,
            team_mate:
              CASE
                WHEN withdrawn_teammate IS NULL THEN team_mate
                ELSE withdrawn_teammate
              END,
            withdrawn: withdrawn,
            tour: tour
          }
        ]) AS entry
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

  return entries
})
