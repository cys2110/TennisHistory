export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (u:Umpire {id: 'Ahmed Abdel-Azim'})-[:UMPIRED]->
        (m:Match)-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event
          WHERE
          coalesce(
            e.start_date,
            e.atp_start_date,
            e.wta_start_date,
            e.men_start_date,
            e.women_start_date,
            null
          ) IS
          NOT
          NULL)-
          [:IN_YEAR]->
        (y:Year)
      OPTIONAL MATCH (e)-[:EDITION_OF]->(t:Tournament)
      MATCH
        (p1:Player)-[:ENTERED]->
        (:Entry)-[:SCORED]->
        (score:P1|T1)-[:SCORED]->
        (m)<-[:SCORED]-
        (:P2|T2)<-[:SCORED]-
        (:Entry)<-[:ENTERED]-
        (p2:Player)
      WITH DISTINCT
        *,
        apoc.coll.min([
          e.start_date,
          e.atp_start_date,
          e.wta_start_date,
          e.men_start_date,
          e.women_start_date
        ]) AS start_date
      ORDER BY start_date, r.number DESC, m.match_no ASC
      CALL (p1, e) {
        MATCH (p1)-[:REPRESENTS]->(cz:Country)
        OPTIONAL MATCH
          (p1)-
            [c2:REPRESENTED WHERE
              (c2.start_date <= e.start_date AND c2.end_date > e.start_date) OR
              ('ATP' IN labels(p1) AND
                c2.start_date <= coalesce(e.atp_start_date, e.men_start_date) AND
                c2.end_date > coalesce(e.atp_start_date, e.men_start_date)) OR
              ('WTA' IN labels(p1) AND
                c2.start_date <= coalesce(e.wta_start_date, e.women_start_date) AND
                c2.end_date > coalesce(e.wta_start_date, e.women_start_date))]->
          (c3:Country)
        RETURN
          CASE
            WHEN c2 IS NOT NULL THEN properties(c3)
            ELSE properties(cz)
          END AS c1
      }
      CALL (p2, e) {
        MATCH (p2)-[:REPRESENTS]->(cz:Country)
        OPTIONAL MATCH
          (p2)-
            [c3:REPRESENTED WHERE
              (c3.start_date <= e.start_date AND c3.end_date > e.start_date) OR
              ('ATP' IN labels(p2) AND
                c3.start_date <= coalesce(e.atp_start_date, e.men_start_date) AND
                c3.end_date > coalesce(e.atp_start_date, e.men_start_date)) OR
              ('WTA' IN labels(p2) AND
                c3.start_date <= coalesce(e.wta_start_date, e.women_start_date) AND
                c3.end_date > coalesce(e.wta_start_date, e.women_start_date))]->
          (c4:Country)
        RETURN
          CASE
            WHEN c3 IS NOT NULL THEN properties(c4)
            ELSE properties(cz)
          END AS c2
      }
      WITH
        m,
        r,
        t,
        e,
        y,
        COLLECT(
          DISTINCT
          apoc.map.merge(
            apoc.map.submap(p1, ['id', 'first_name', 'last_name']),
            {country: c1}
          )) AS p1,
        COLLECT(
          DISTINCT
          apoc.map.merge(
            apoc.map.submap(p2, ['id', 'first_name', 'last_name']),
            {country: c2}
          )) AS p2,
        CASE
          WHEN score.serve1 IS NOT NULL THEN true
          ELSE false
        END AS stats,
        CASE
          WHEN m:ATP THEN 'ATP'
          WHEN m:WTA THEN 'WTA'
          WHEN m:Men THEN 'ITF (M)'
          ELSE 'ITF (W)'
        END AS tour,
        CASE
          WHEN m:Singles THEN 'Singles'
          ELSE 'Doubles'
        END AS type,
        CASE
          WHEN m:Main THEN 'Main'
          ELSE 'Qualifying'
        END AS draw
      WITH
        t,
        e,
        {
          tour: tour,
          type: type,
          draw: draw,
          p1: p1,
          p2: p2,
          stats: stats,
          round: r.round,
          match_no: m.match_no
        } AS match,
        y
      RETURN DISTINCT {id: e.id, tournament: properties(t), year: y.id, match: match} AS event
    `,
    { id }
  )

  const results = records.map(record => {
    const event = record.get("event")
    event["id"] = event["id"].toInt()
    event["year"] = event["year"].toInt()
    event.match["match_no"] = event.match["match_no"].toInt()
    return event
  })

  return results
})
