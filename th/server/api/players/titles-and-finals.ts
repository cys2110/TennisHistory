export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})
      OPTIONAL MATCH (p)-[:ENTERED]->(:Entry)-[:SCORED]->(x:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round {round: 'Final'})-[:ROUND_OF]->(e:Event)-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (y:Year)<-[:IN_YEAR]-(e)-[:ON_SURFACE]->(s:Surface)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      WITH DISTINCT e, t, y, s, v, c, x
        ORDER BY e.start_date
      WITH y, e, t, s, x, COLLECT({id: v.id, name: v.name, city: v.city, country: {id: c.id, name: c.name, alpha2: c.alpha2}}) AS venues
      WITH CASE
        WHEN 'Winner' IN labels(x) THEN {
          year: toString(y.id),
          id: toString(e.id),
          tournament: {
            id: toString(t.id),
            name: t.name
          },
          name: e.sponsor_name,
          category: e.category,
          surface: {id: s.id, surface: s.surface},
          venues: venues,
          dates: CASE
            WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') + ' - ' + apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') + ' - ' + apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            ELSE apoc.temporal.format(e.start_date, 'dd') + ' - ' + apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          END,
          draw_type: e.draw_type
        }
        ELSE NULL
        END AS titles, CASE
        WHEN 'Loser' IN labels(x) THEN {
          year: toString(y.id),
          id: toString(e.id),
          tournament: {
            id: toString(t.id),
            name: t.name
          },
          name: e.sponsor_name,
          category: e.category,
          surface: {id: s.id, surface: s.surface},
          venues: venues,
          dates: CASE
            WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') + ' - ' + apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') + ' - ' + apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            ELSE apoc.temporal.format(e.start_date, 'dd') + ' - ' + apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          END,
          draw_type: e.draw_type
        }
        ELSE NULL
        END AS finals
      WITH COLLECT(titles) AS titles, COLLECT(finals) AS finals
      WITH apoc.map.groupByMulti(titles, "year") AS titles, apoc.map.groupByMulti(finals, "year") AS finals
      RETURN {titles: titles, finals: finals} AS result
    `,
    { id }
  )

  const results = records[0].get("result")
  const titles: any = []
  const finals: any = []

  for (const [key, value] of Object.entries(results.titles || {})) {
    titles.push({
      title: key,
      events: value
    })
  }

  for (const [key, value] of Object.entries(results.finals || {})) {
    finals.push({
      title: key,
      events: value
    })
  }

  return { titles, finals }
})
