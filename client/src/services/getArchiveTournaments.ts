import type { Categories, MonthNames, Surfaces } from '@/types/enums'
import driver from './driver'
import { MONTHS } from '@/utils/variables'

export const getArchiveTournaments = async (surface: Surfaces[], month: MonthNames[], category: Categories[], year: string[]) => {

  const monthArray = Array.isArray(month) ? month : [month]
  const monthNumbers = monthArray.map(month => MONTHS[month])

  const formattedParams = {
    surface: Array.isArray(surface) ? surface : [surface],
    month: monthNumbers,
    category: Array.isArray(category) ? category : [category],
    year: Array.isArray(year) ? year.map((y) => parseInt(y)) : [parseInt(year)],
  }

  const { records } = await driver.executeQuery(
    `/* cypher */
        MATCH (y:Year)<-[:TOOK_PLACE_IN]-(e:Event)-[:ON_SURFACE]->(s:Surface)
        MATCH (t:Tournament)<-[:EDITION_OF]-(e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        WHERE
          y.id IN $year
          AND s.surface IN $surface
          AND e.start_date.month IN $month
          AND e.category IN $category
        WITH e, s, t, v, c, y
        ORDER BY e.start_date
        WITH {
          year: toString(y.id),
          surface: s.surface,
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
      `,
    formattedParams,
  )

  const events = records.map((record) => record.toObject())

  return events[0].events
}