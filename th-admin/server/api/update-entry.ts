import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    fid: string
    type: "Singles" | "Doubles"
    rank?: string
    points?: string
    pm?: string
    seed?: string
    q_seed?: string
    status?: string
    q_status?: string
  }

  const { fid, type, rank, points, pm, seed, q_seed, status, q_status } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (f:Entry:$($type) {id: $fid})
      SET f.rank = $rank, f.points = $points, f.pm = $pm, f.seed = $seed, f.q_seed = $q_seed, f.status = $status, f.q_status = $q_status
      RETURN f
    `,
    {
      fid,
      type,
      rank: rank ? int(rank) : null,
      points: points ? int(points) : null,
      pm: pm ? (Number.isInteger(Number(pm)) ? int(pm) : pm) : null,
      seed: seed ? int(seed) : null,
      q_seed: q_seed ? int(q_seed) : null,
      status: status || null,
      q_status: q_status || null
    }
  )

  return summary
})
