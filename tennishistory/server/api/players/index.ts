export default defineEventHandler(async event => {
  interface QueryProps {
    skip: string
    tour?: TourType
    countries?: string[]
    players?: string[]
    coaches: string[]
    minYear?: string
    maxYear?: string
    status?: string
    playerSort: SortType
    firstYearSort: SortType
    lastYearSort: SortType
  }

  const { skip, tour, countries, players, coaches, minYear, maxYear, status, playerSort, firstYearSort, lastYearSort } = getQuery<QueryProps>(event)

  const formattedParams = {
    skip: skip || 0,
    tour: tour ?? null,
    countries: countries ? (Array.isArray(countries) ? countries : [countries]) : null,
    players: players ? (Array.isArray(players) ? players : [players]) : null,
    coaches: coaches ? (Array.isArray(coaches) ? coaches : [coaches]) : null,
    minYear: minYear ? parseInt(minYear, 10) : null,
    maxYear: maxYear ? parseInt(maxYear, 10) : null,
    status: status ? (status === "Active" ? true : false) : null
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    CALL () {
      MATCH (p:Player)-[:REPRESENTS]->(c:Country)
      WHERE
        ($tour IS NULL OR $tour IN labels(p)) AND
        ($countries IS NULL OR c.id IN $countries) AND
        ($players IS NULL OR p.id IN $players) AND
        ($coaches IS NULL OR
          EXISTS {
            MATCH (p)<-[:COACHES|COACHED]-(coach:Coach WHERE coach.id IN $coaches)
          }) AND
        ($minYear IS NULL AND $maxYear IS NULL AND $status IS NULL OR
          EXISTS {
            MATCH
              (p)-[:ENTERED]->
              (:Entry)-[:SCORED]->
              (:Score)-[:SCORED]->
              (:Match)-[:PLAYED]->
              (:Round)-[:ROUND_OF]->
              (:Event)-[:IN_YEAR]->
              (y:Year)
            WHERE
              ($status IS NULL OR
                ($status = true AND y.id = date().year) OR
                ($status = false AND y.id < date().year)) AND
              (($minYear IS NULL OR y.id >= $minYear) AND
                ($maxYear IS NULL OR y.id <= $maxYear))
          })
      RETURN COUNT(p) AS count
    }
    CALL () {
      MATCH (p:Player)-[:REPRESENTS]->(c:Country)
      WHERE
        ($tour IS NULL OR $tour IN labels(p)) AND
        ($countries IS NULL OR c.id IN $countries) AND
        ($players IS NULL OR p.id IN $players)
      CALL (p) {
        OPTIONAL MATCH (coach:Coach)-[t:COACHES|COACHED]->(p)
        RETURN
          CASE WHEN COUNT(coach) = 0 THEN null ELSE
          COLLECT(
            DISTINCT
            apoc.map.clean(
              apoc.map.merge(
                apoc.map.submap(
                  coach,
                  ['id', 'first_name', 'last_name'],
                  null,
                  false
                ),
                {
                  labels: labels(coach),
                  start_year: t.start_date,
                  end_year: t.end_date
                }
              ),
              [],
              [null]
            )) END AS coaches
      }
      CALL (p) {
        OPTIONAL MATCH
          (p)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (:Score)-[:SCORED]->
          (:Match)-[:PLAYED]->
          (:Round)-[:ROUND_OF]->
          (:Event)-[:IN_YEAR]->
          (y:Year)
        RETURN min(y.id) AS minYear, max(y.id) AS maxYear
      }
      WITH p, c, coaches, minYear, maxYear, [x IN coaches | x.id] AS coach_ids, [x IN labels(p) WHERE NOT x IN ['Player', 'Coach', 'Update']][0] AS tour
      WHERE
        ($minYear IS NULL OR minYear >= $minYear) AND
        ($maxYear IS NULL OR maxYear <= $maxYear) AND
        ($coaches IS NULL OR
          (SIZE(coach_ids) > 0 AND ANY(id IN $coaches WHERE id IN coach_ids))) AND
        ($status IS NULL OR
          ($status = true AND maxYear = date().year) OR
          ($status = false AND maxYear < date().year))
      ORDER BY p.last_name, p.first_name
      SKIP toInteger($skip)
      LIMIT 40
      RETURN
        apoc.map.clean(
          apoc.map.merge(
            apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false),
            {
              country: properties(c),
              tour: tour,
              coaches: coaches,
              min_year: minYear,
              max_year: maxYear
            }
          ),
          [],
          [null]
        ) AS player
    }
    RETURN count, player
    `,
    formattedParams
  )

  const results = records.map(record => {
    const player = record.get("player")

    if (player.min_year) player.min_year = player.min_year.toInt()
    if (player.max_year) player.max_year = player.max_year.toInt()

    if (player.coaches) {
      for (const coach of player.coaches) {
        if (coach.start_year) {
          coach.start_year = coach.start_year?.year?.toInt()
        }
        if (coach.end_year) coach.end_year = coach.end_year?.year?.toInt()
      }
    }

    return player
  })

  return {
    count: records[0]?.get("count").toInt() || 0,
    players: results
  }
})
