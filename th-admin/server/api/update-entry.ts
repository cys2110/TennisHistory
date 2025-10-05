export default defineEventHandler(async event => {
  const { fid, type, rank, points, pm, seed, q_seed, status, q_status } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (f:Entry:$($type) {id: $fid})
      SET f.rank = toInteger($rank), f.points = toInteger($points), f.pm = toInteger($pm), f.seed = toInteger($seed), f.q_seed = toInteger($q_seed), f.status = $status, f.q_status = $q_status
      RETURN f
    `,
    {
      fid,
      type,
      rank: rank ?? null,
      points: points ?? null,
      pm: pm ?? null,
      seed: seed ?? null,
      q_seed: q_seed ?? null,
      status: status || null,
      q_status: q_status || null
    }
  )

  return summary
})
