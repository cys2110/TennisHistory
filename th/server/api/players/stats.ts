export default defineEventHandler(async event => {
  interface QueryProps {
    surfaces: SurfaceType | SurfaceType[]
    years: string | string[]
    id: string
    environments: EnvironmentType[] | EnvironmentType
    draw: DrawType | undefined
    level: "Challenger" | "Tour" | undefined
  }

  const { surfaces, years, id, environments, draw, level } = getQuery<QueryProps>(event)

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
    environments:
      environments ?
        Array.isArray(environments) ?
          environments
        : [environments]
      : [],
    draw: draw ?? null,
    level: level ?? null,
    challenger: CHALLENGER_CATEGORIES
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Singles)<-[:SCORED]-(s1:Score)
      MATCH (m)-[:PLAYED]->(:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year)
      OPTIONAL MATCH (e)-[:ON_SURFACE]-(z:Surface)
      WITH *,
        (e.category IN $challenger OR
          (m:ATP AND e.atp_category IN $challenger) OR
          (m:WTA AND e.wta_category IN $challenger)) AS isChallenger,
        (e.category IS NULL OR NOT e.category IN $challenger) AND
          (NOT m:ATP OR e.atp_category IS NULL OR NOT e.atp_category IN $challenger) AND
          (NOT m:WTA OR e.wta_category IS NULL OR NOT e.wta_category IN $challenger) AS isNotChallenger,
        e:Women OR e:Men AS isITF
      WHERE
        $surfaces = [] OR z.surface IN $surfaces AND
        $environments = [] OR z.environment IN $environments AND
        $years = [] OR y.id IN $years AND
        $draw IS NULL OR $draw IN labels(m) AND
        $level IS NULL OR ($level = 'Challenger' AND isChallenger) OR ($level = 'Tour' AND isNotChallenger AND NOT isITF)
      RETURN [
        {category: 'Aces', value: sum(s.aces), suffix: false},
        {category: 'Aces v. aced', value: round((avg(s.aces) / avg(s.aces + s1.aces)) * 100, 0)},
        {category: 'Double faults', value: sum(s.dfs), suffix: false},
        {category: '1st serve', value: round(avg(s.serve1) / avg(s.serve1 + s.serve2) * 100, 0)},
        {category: '1st serve points won', value: round(avg(s.serve1_w) / avg(s.serve1) * 100, 0)},
        {category: '2nd serve points won', value: round(avg(s.serve2_w) / avg(s.serve2) * 100, 0)},
        {category: 'Break points won', value: round(avg(s.bps_saved) / avg(s.bps_faced) * 100, 0)},
        {category: 'Service games played', value: sum(s.serve_games), suffix: false},
        {category: 'Service games won', value: round((sum(s.bps_faced) - sum(s.bps_saved)) / toFloat(sum(s.serve_games)) * 100, 0)},
        {category: 'Service points won', value: round(avg(s.serve1_w + s.serve2_w) / avg(s.serve1 + s.serve2) * 100, 0)},
        {category: '1st serve return points won', value: round(avg(s.ret1_w) / avg(s.ret1) * 100, 0)},
        {category: '2nd serve return points won', value: round(avg(s.ret2_w) / avg(s.ret2) * 100, 0)},
        {category: 'Break points converted', value: round(avg(s.bps_converted) / avg(s.bp_opps) * 100, 0)},
        {category: 'Return games played', value: sum(s.return_games), suffix: false},
        {category: 'Return games won', value: round(sum(s.bps_converted) / toFloat(sum(s.return_games)) * 100, 0)},
        {category: 'Return points won', value: round(avg(s.ret1_w + s.ret2_w) / avg(s.ret1 + s.ret2) * 100, 0)},
        {category: "Net points won", value: round(avg(s.net_w) / avg(s.net) * 100, 0)},
        {category: 'Winners', value: sum(s.winners), suffix: false},
        {category: 'Unforced errors', value: sum(s.ues), suffix: false},
        {category: 'Winners to unforced %', value: round(sum(s.winners) / (toFloat(sum(s.winners)) + toFloat(sum(s.ues))) * 100, 0)},
        {category: 'Total points won', value: round(avg(s.serve1_w + s.serve2_w + s.ret1_w + s.ret2_w) / avg(s.serve1 + s.serve2 + s.ret1 + s.ret2) * 100, 0)}
      ] as stats
    `,
    formattedParams
  )

  const statsObject = records[0].toObject()
  const stats = statsObject.stats.map((stat: any) => {
    return {
      ...stat,
      value: stat.value?.low ?? stat.value
    }
  })

  return stats
})
