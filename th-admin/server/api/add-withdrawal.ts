export default defineEventHandler(async event => {
  const { id, type, draw, reason, team_reason, eid, team_mate, seed, status, rank } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (e:Event {id: toInteger($eid)})
      MATCH (p:Player {id: $id})
      MERGE (f:Entry:$($type) {id: $eid || ' ' || p.id})
      MERGE (p)-[:ENTERED]->(f)
      SET f.status = $status, f.rank = toInteger($rank)
      CALL (*) {
        WHEN $draw = 'Main' THEN {
          MERGE (f)-[t:WITHDREW]->(e)
          SET t.reason = $reason, t.team_reason = $team_reason, t.team_mate = $team_mate
        }
        ELSE {
          MERGE (f)-[t:Q_WITHDREW]->(e)
          SET t.reason = $reason, t.team_reason = $team_reason, t.team_mate = $team_mate
        }
      }
      CALL (*) {
        WHEN $seed IS NOT NULL THEN {
          WHEN $draw = 'Main' THEN {
            MERGE (f)-[:SEEDED]->(e)
            SET f.seed = toInteger($seed)
          }
          ELSE {
            MERGE (f)-[:Q_SEEDED]->(e)
            SET f.q_seed = toInteger($seed)
          }
        }
      }
      RETURN f
    `,
    {
      id,
      type,
      reason: reason || null,
      team_reason: team_reason || null,
      draw,
      eid,
      seed: seed || null,
      status: status || null,
      rank,
      team_mate: team_mate || null
    }
  )

  return summary
})
