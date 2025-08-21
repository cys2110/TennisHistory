export default defineEventHandler(async event => {
  interface QueryProps {
    surfaces: SurfaceType | SurfaceType[]
    years: string | string[]
    id: string
    environment: EnvironmentType | undefined
    draw: "Main" | "Qualifying" | undefined
    level: "ITF" | "Challenger" | "Tour" | undefined
  }

  const { surfaces, years, id, environment, draw, level } = getQuery<QueryProps>(event)

  const formattedParams = {
    id,
    surfaces:
      surfaces ?
        Array.isArray(surfaces) ?
          surfaces
        : [surfaces]
      : [],
    years:
      years ?
        Array.isArray(years) ?
          years.map(year => Number(year))
        : [Number(years)]
      : [],
    environment: environment ?? null,
    draw: draw ?? null,
    level: level ?? null
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      WITH ['ATP Challenger 125', 'WTA 125'] AS challenger
      MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Singles)-[:PLAYED]->(:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year)
      OPTIONAL MATCH (e)-[:ON_SURFACE]-(z:Surface)
      WITH *,
        (e.category IN challenger OR
          (m:ATP AND e.atp_category IN challenger) OR
          (m:WTA AND e.wta_category IN challenger)) AS isChallenger,
        (e.category IS NULL OR NOT e.category IN challenger) AND
          (NOT m:ATP OR e.atp_category IS NULL OR NOT e.atp_category IN challenger) AND
          (NOT m:WTA OR e.wta_category IS NULL OR NOT e.wta_category IN challenger) AS isNotChallenger
      WHERE
        $surfaces = [] OR z.surface IN $surfaces AND
        $environment IS NULL OR z.environment = $environment AND
        $years = [] OR y.id IN $years AND
        $draw IS NULL OR $draw IN labels(m) AND
        $level IS NULL OR ($level = 'ITF' AND e:ITF) OR ($level = 'Challenger' AND isChallenger) OR ($level = 'Tour' AND isNotChallenger AND NOT e:ITF)
      RETURN [
        {category: 'Aces', value: sum(s.aces), suffix: false},
        {category: 'Double faults', value: sum(s.dfs), suffix: false},
        {category: '1st serve', value: round((sum(s.serve1) / (toFloat(sum(s.serve1)) + toFloat(sum(s.serve2)))) * 100, 0)},
        {category: '1st serve points won', value: round((sum(s.serve1_w) / toFloat(sum(s.serve1))) * 100, 0)},
        {category: '2nd serve points won', value: round((sum(s.serve2_w) / toFloat(sum(s.serve2))) * 100, 0)},
        {category: 'Break points won', value: round((sum(s.bps_saved) / toFloat(sum(s.bps_faced))) * 100, 0)},
        {category: 'Service points won', value: round((sum(s.serve1_w) + sum(s.serve2_w)) / (toFloat(sum(s.serve1)) + toFloat(sum(s.serve2))) * 100, 0)},
        {category: '1st serve return points won', value: round((sum(s.ret1_w) / toFloat(sum(s.ret1))) * 100, 0)},
        {category: '2nd serve return points won', value: round((sum(s.ret2_w) / toFloat(sum(s.ret2))) * 100, 0)},
        {category: 'Break points converted', value: round((sum(s.bps_converted) / toFloat(sum(s.bp_opps))) * 100, 0)},
        {category: 'Return points won', value: round((sum(s.ret1_w) + sum(s.ret2_w)) / (toFloat(sum(s.ret1)) + toFloat(sum(s.ret2))) * 100, 0)},
        {category: 'Total points won', value: round((sum(s.serve1_w) + sum(s.serve2_w) + sum(s.ret1_w) + sum(s.ret2_w)) / (toFloat(sum(s.serve1)) + toFloat(sum(s.serve2)) + toFloat(sum(s.ret1)) + toFloat(sum(s.ret2))) * 100, 0)}
      ] as stats
    `,
    formattedParams
  )

  const statsObject = records[0].toObject()
  const stats = statsObject.stats.map((stat: { category: string; value: { low: number }; suffix?: boolean }) => {
    return {
      ...stat,
      value: stat.value.low ?? stat.value
    }
  })

  return stats
})
