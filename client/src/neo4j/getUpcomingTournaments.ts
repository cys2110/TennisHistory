import { executeQuery } from 'src/boot/neo4j'

interface Params {
  surface: string
  month: string
  category: string
}

export const getUpcomingTournaments = async ({ surface, month, category }: Params) => {
  const params = {
    surface: surface === 'All' ? null : surface,
    month: month === 'All' ? null : parseInt(month),
    category: category === 'All' ? null : category,
  }
  const query = `
        MATCH (y:Year)<-[:TOOK_PLACE_IN]-(e:Event)-[:ON_SURFACE]->(s:Surface)
        MATCH (t:Tournament)<-[:EDITION_OF]-(e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        WHERE
          e.end_date >= date()
          AND ($surface IS NULL OR s.surface = $surface)
          AND ($month IS NULL OR e.start_date.month = $month)
          AND ($category IS NULL OR e.category = $category)
        WITH e, s, t, v, c, y
        ORDER BY e.start_date
        WITH {
          year: toString(y.id),
          surface: s.id,
          tid: toString(t.id),
          tname: t.name,
          city: v.city,
          country: c.id,
          start: apoc.temporal.format(e.start_date, 'yyyy-MM-dd'),
          dates: CASE
            WHEN e.start_date.year <> e.end_date.year THEN apoc.temporal.format(e.start_date, 'dd MMMM yyyy') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            WHEN e.start_date.month <> e.end_date.month THEN apoc.temporal.format(e.start_date, 'dd MMMM') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            WHEN e.start_date IS NOT NULL AND e.end_date IS NOT NULL THEN apoc.temporal.format(e.start_date, 'dd') || ' - ' || apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            ELSE NULL
          END,
          eid: toString(e.id),
          category: e.category,
          ename: e.sponsor_name
        } as event
        RETURN COLLECT(event) as events
      `
  try {
    const results = await executeQuery(query, params)
    return results[0]?.events
  } catch (e) {
    console.error(e)
  }
}
