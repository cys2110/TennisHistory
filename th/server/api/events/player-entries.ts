export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})
      MATCH (c:Country)<-[:REPRESENTS]-(p:Player)-[:ENTERED]->(f:Entry)-[:SCORED]-(s:Score) WHERE f.id STARTS WITH toString(e.id)
      OPTIONAL MATCH (p)-[z:REPRESENTED WHERE
        (z.start_date <= e.start_date OR
          ('ATP' IN labels(p) AND
            z.start_date <= coalesce(e.atp_start_date, e.men_start_date)) OR
          ('WTA') IN labels(p) AND
          z.start_date <= coalesce(e.wta_start_date, e.women_start_date)) AND
        (z.end_date > e.start_date OR
          ('ATP' IN labels(p) AND
            z.end_date > coalesce(e.atp_start_date, e.men_start_date) OR
            ('WTA' IN labels(p) AND
              z.end_date > coalesce(e.wta_start_date, e.women_start_date))))]->(o:Country)
      WITH
        apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false) AS player,
        CASE WHEN z IS NULL THEN properties(c) ELSE properties(o) END AS country,
        CASE WHEN f:Singles THEN 'Singles' ELSE 'Doubles' END AS matchType,
        CASE WHEN s:Main THEN 'Main' ELSE 'Qualifying' END AS drawType,
        CASE WHEN p:ATP THEN 'ATP' ELSE 'WTA' END AS tour,
        apoc.map.submap(f, ['seed', 'q_seed', 'status', 'q_status', 'rank'], null, false) AS entry
      RETURN DISTINCT apoc.map.clean(apoc.map.mergeList([entry, player, {country: country, type: matchType, draw: drawType, tour: tour}]), [], [null]) AS entry
    `,
    { id }
  )

  const entries = records.map(record => {
    const entry = record.get("entry")
    const numberKeys = ["rank", "seed", "q_seed"]

    for (const key of numberKeys) {
      if (entry[key]) entry[key] = entry[key].toInt()
    }

    return entry
  })

  return entries
})
