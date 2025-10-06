import { int } from "neo4j-driver"

export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})-[:EDITION_OF]->(t:Tournament)
      OPTIONAL MATCH (e)-[:ON_SURFACE]->(s:Surface)
      OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
      OPTIONAL MATCH (sup:Supervisor)-[:SUPERVISED]->(e)
      WITH e, t, s, v, c, COLLECT(DISTINCT sup.id) AS supervisors, CASE WHEN v IS NULL THEN [] ELSE COLLECT(DISTINCT apoc.map.merge(properties(v), {country: properties(c)})) END AS venues
      RETURN [x IN labels(e) WHERE x <> 'Event'] AS tours, properties(e) AS event, s.id AS surface, venues, supervisors, properties(t) AS tournament
    `,
    { id: int(id) }
  )

  const event = records[0].toObject()

  return {
    ...event.event,
    tournament: event.tournament.name,
    tours: event.tours,
    surface: event.surface || undefined,
    supervisors: event.supervisors || [],
    venues: event.venues || [],
    id: event.event.id.toInt(),
    pm: event.event.pm?.toNumber() || undefined,
    tfc: event.event.tfc?.toNumber() || undefined,
    atp_pm: event.event.atp_pm?.toNumber() || undefined,
    wta_pm: event.event.wta_pm?.toNumber() || undefined,
    men_pm: event.event.men_pm?.toNumber() || undefined,
    women_pm: event.event.women_pm?.toNumber() || undefined,
    atp_tfc: event.event.atp_tfc?.toNumber() || undefined,
    wta_tfc: event.event.wta_tfc?.toNumber() || undefined,
    start_date: event.event.start_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    end_date: event.event.end_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    atp_start_date: event.event.atp_start_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    atp_end_date: event.event.atp_end_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    wta_start_date: event.event.wta_start_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    wta_end_date: event.event.wta_end_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    men_start_date: event.event.men_start_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    men_end_date: event.event.men_end_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    women_start_date: event.event.women_start_date?.toStandardDate().toISOString().slice(0, 10) || undefined,
    women_end_date: event.event.women_end_date?.toStandardDate().toISOString().slice(0, 10) || undefined
  }
})
