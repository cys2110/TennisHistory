export default defineEventHandler(async event => {
  const { year, id } = getQuery<{ year: string; id: string }>(event)

  const formattedParams = {
    id,
    year: Number(year)
  }

  const { records: statsRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (p:Player {id: $id})-[:ENTERED]->
        (f:Entry)-[:SCORED]->
        (s:Score)-[:SCORED]->
        (m:Best3|Best5)-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event)-[:IN_YEAR]->
        (y:Year {id: $year})
      WHERE m:Singles
      WITH
        sum(
          CASE
            WHEN s:Winner THEN 1
            ELSE 0
          END) AS wins,
        sum(
          CASE
            WHEN s:Loser THEN 1
            ELSE 0
          END) AS losses,
        sum(
          CASE
            WHEN s:Winner AND r.round = 'Final' THEN 1
            ELSE 0
          END) AS titles
      RETURN [
        {category: 'Wins', value: wins},
        {category: 'Losses', value: losses},
        {category: 'Titles', value: titles}
      ] AS stats
    `,
    formattedParams
  )

  const { records: activityRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH
        (p:Player {id: $id})-[:ENTERED]->
        (f:Entry)-[:SCORED]->
        (s:Score)-[:SCORED]->
        (m:Singles)-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event)-[:IN_YEAR]->
        (:Year {id: $year})
      MATCH (t:Tournament)<-[:EDITION_OF]-(e)
      WITH
        *,
        apoc.coll.min([e.start_date, e.atp_start_date, e.wta_start_date]) AS start_date
      ORDER BY start_date, r.number DESC, m.match_no DESC
      CALL (e, m) {
        OPTIONAL MATCH (e)-[:ON_SURFACE]->(z:Surface)
        OPTIONAL MATCH (m)-[:PLAYED]->(:Tie)-[:ON_SURFACE]->(z1:Surface)
        RETURN
          CASE
            WHEN
              z IS NOT NULL
              THEN {id: z.id, surface: z.surface, environment: z.environment}
            ELSE {id: z1.id, surface: z1.surface, environment: z1.environment}
          END AS surface
      }
      CALL (e, m) {
        OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]->(v:Venue)-[:LOCATED_IN]->(c:Country)
        OPTIONAL MATCH
          (m)-[:PLAYED]->
          (:Tie)-[:TOOK_PLACE_IN]->
          (v1:Venue)-[:LOCATED_IN]->
          (c1:Country)
        WITH
          CASE
            WHEN
              v IS NOT NULL
              THEN
                {
                  id: v.id,
                  name: v.name,
                  city: v.city,
                  country: {id: c.id, name: c.name, alpha2: c.alpha2}
                }
            ELSE
              {
                id: v1.id,
                name: v1.name,
                city: v1.city,
                country: {id: c1.id, name: c1.name, alpha2: c1.alpha2}
              }
          END AS location
        RETURN COLLECT(location) AS locations
      }
      CALL (m, s, r, e) {
        OPTIONAL MATCH
          (m)<-[:SCORED]-(os:Score)<-[:SCORED]-(of:Entry)<-[:ENTERED]-(op:Player)
        WHERE op.id <> $id
        MATCH (m)<-[:SCORED]-(:Winner)<-[:SCORED]-(:Entry)<-[:ENTERED]-(w:Player)
        CALL (op, e) {
          OPTIONAL MATCH (op)-[:REPRESENTS]->(oc:Country)
          OPTIONAL MATCH (op)-[ox:REPRESENTED]->(on:Country)
          RETURN
            CASE
              WHEN
                ox IS NOT NULL AND
                ox.start_date <= e.start_date AND
                ox.end_date > e.start_date
                THEN {id: on.id, alpha2: on.alpha2, name: on.name}
              ELSE {id: oc.id, alpha2: oc.alpha2, name: oc.name}
            END AS country
        }
        WITH
          *,
          CASE
            WHEN op IS NULL THEN null
            ELSE
              {
                id: op.id,
                name: op.first_name || ' ' || op.last_name,
                country: country,
                incomplete: coalesce(s.incomplete, os.incomplete, null),
                seed: of.seed,
                status: of.status,
                rank: of.rank,
                q_seed: of.q_seed,
                q_status: of.q_status
              }
          END AS opponent
        RETURN {
          round: r.round,
          match_no: m.match_no,
          incomplete: m.incomplete,
          winner_id: w.id,
          sets: [
            toString(s.s1) || toString(os.s1),
            toString(s.s2) || toString(os.s2),
            toString(s.s3) || toString(os.s3),
            toString(s.s4) || toString(os.s4),
            toString(s.s5) || toString(os.s5)
          ],
          tbs: [
            CASE
              WHEN
                s.t1 IS NOT NULL
                THEN toString(apoc.coll.min([x IN [s.t1, os.t1] WHERE x IS NOT NULL]))
              ELSE null
            END,
            CASE
              WHEN
                s.t2 IS NOT NULL
                THEN toString(apoc.coll.min([x IN [s.t2, os.t2] WHERE x IS NOT NULL]))
              ELSE null
            END,
            CASE
              WHEN
                s.t3 IS NOT NULL
                THEN toString(apoc.coll.min([x IN [s.t3, os.t3] WHERE x IS NOT NULL]))
              ELSE null
            END,
            CASE
              WHEN
                s.t4 IS NOT NULL
                THEN toString(apoc.coll.min([x IN [s.t4, os.t4] WHERE x IS NOT NULL]))
              ELSE null
            END,
            CASE
              WHEN
                s.t5 IS NOT NULL
                THEN toString(apoc.coll.min([x IN [s.t5, os.t5] WHERE x IS NOT NULL]))
              ELSE null
            END
          ],
          opponent: opponent
        } AS match
      }
      WITH e, t, surface, f, COLLECT(DISTINCT match) AS matches, locations
      RETURN {
        tours: labels(e),
        id: e.id,
        name: e.sponsor_name,
        tournament: {id: t.id, name: t.name},
        category: e.category,
        atp_category: e.atp_category,
        wta_category: e.wta_category,
        dates:
          CASE
            WHEN e.start_date IS NULL OR e.end_date IS NULL THEN null
            WHEN
              e.start_date.year <> e.end_date.year
              THEN
                apoc.temporal.format(e.start_date, 'dd MMMM yyyy') ||
                ' - ' ||
                apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            WHEN
              e.start_date.month <> e.end_date.month
              THEN
                apoc.temporal.format(e.start_date, 'dd MMMM') ||
                ' - ' ||
                apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
            ELSE
              apoc.temporal.format(e.start_date, 'dd') ||
              ' - ' ||
              apoc.temporal.format(e.end_date, 'dd MMMM yyyy')
          END,
        atp_dates:
          CASE
            WHEN e.atp_start_date IS NULL OR e.atp_end_date IS NULL THEN null
            WHEN
              e.atp_start_date.year <> e.atp_end_date.year
              THEN
                apoc.temporal.format(e.atp_start_date, 'dd MMMM yyyy') ||
                ' - ' ||
                apoc.temporal.format(e.atp_end_date, 'dd MMMM yyyy')
            WHEN
              e.atp_start_date.month <> e.atp_end_date.month
              THEN
                apoc.temporal.format(e.atp_start_date, 'dd MMMM') ||
                ' - ' ||
                apoc.temporal.format(e.atp_end_date, 'dd MMMM yyyy')
            ELSE
              apoc.temporal.format(e.atp_start_date, 'dd') ||
              ' - ' ||
              apoc.temporal.format(e.atp_end_date, 'dd MMMM yyyy')
          END,
        wta_dates:
          CASE
            WHEN e.wta_start_date IS NULL OR e.wta_end_date IS NULL THEN null
            WHEN
              e.wta_start_date.year <> e.wta_end_date.year
              THEN
                apoc.temporal.format(e.wta_start_date, 'dd MMMM yyyy') ||
                ' - ' ||
                apoc.temporal.format(e.wta_end_date, 'dd MMMM yyyy')
            WHEN
              e.wta_start_date.month <> e.wta_end_date.month
              THEN
                apoc.temporal.format(e.wta_start_date, 'dd MMMM') ||
                ' - ' ||
                apoc.temporal.format(e.wta_end_date, 'dd MMMM yyyy')
            ELSE
              apoc.temporal.format(e.wta_start_date, 'dd') ||
              ' - ' ||
              apoc.temporal.format(e.wta_end_date, 'dd MMMM yyyy')
          END,
        venues: locations,
        surface: surface,
        currency: e.currency,
        matches: matches,
        player: {
          seed: f.seed,
          status: f.status,
          rank: f.rank,
          points: f.points,
          pm: apoc.number.format(f.pm, '#,###'),
          q_seed: f.q_seed,
          q_status: f.q_status
        }
      } AS event
    `,
    formattedParams
  )

  const statsResults = statsRecords[0].get("stats")
  const activityResults = activityRecords.map(record => record.get("event"))

  return {
    stats: statsResults.map((stat: any) => ({
      category: stat.category,
      value: stat.value.low
    })),
    activity: activityResults.map((event: any) => ({
      ...event,
      tours: event.tours.filter((tour: string) => tour !== "Event" && tour !== "Update"),
      id: event.id.low,
      tournament: {
        ...event.tournament,
        id: event.tournament.id.low
      },
      player: {
        ...event.player,
        seed: event.player.seed?.low,
        rank: event.player.rank?.low,
        points: event.player.points?.low,
        q_seed: event.player.q_seed?.low
      },
      matches: event.matches.map((match: any) => ({
        ...match,
        match_no: match.match_no.low,
        opponent:
          match.opponent ?
            {
              ...match.opponent,
              seed: match.opponent.seed?.low,
              rank: match.opponent.rank?.low,
              q_seed: match.opponent.q_seed?.low
            }
          : null
      }))
    }))
  }
})
