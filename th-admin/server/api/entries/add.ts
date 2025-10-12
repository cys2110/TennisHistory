import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    eid: string
    type: "Singles" | "Doubles"
    seed?: string
    q_seed?: string
    status?: string
    q_status?: string
  }

  const { id, eid, type, seed, q_seed, status, q_status } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      WITH {Q: 'QUALIFIED', AL: 'ALTERNATE', WC: 'WILD_CARD', LL: 'LUCKY_LOSER'} AS relationships, {AL: 'Q_ALTERNATE', WC: 'Q_WILD_CARD'} AS q_relationships
      MATCH (e:Event {id: toInteger($eid)})
      MATCH (p:Player {id: $id})
      MERGE (f:Entry:$($type) {id: $eid || ' ' || $id})
      MERGE (p)-[:ENTERED]->(f)
      SET f.seed = $seed, f.q_seed = $q_seed, f.status = $status, f.q_status = $q_status

      CALL (*) {
        WHEN $seed IS NOT NULL THEN MERGE (f)-[:SEEDED]-(e)
        WHEN $q_seed IS NOT NULL THEN MERGE (f)-[:Q_SEEDED]-(e)
      }

      CALL (*) {
        WHEN $status IS NOT NULL THEN MERGE (f)-[r:$(relationships[$status])]->(e)
        WHEN $q_status IS NOT NULL THEN MERGE (f)-[r:$(q_relationships[$q_status])]->(e)
      }
    `,
    {
      id,
      eid,
      type,
      seed: seed ? int(seed) : null,
      q_seed: q_seed ? int(q_seed) : null,
      status: status || null,
      q_status: q_status || null
    }
  )

  return summary
})
