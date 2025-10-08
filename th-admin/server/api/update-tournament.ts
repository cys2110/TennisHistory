import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    name?: string
    established?: string
    abolished?: string
    website?: string
    tours: ("ATP" | "WTA" | "Challenger" | "ITF" | "Junior" | "Wheelchair")[]
  }

  const { id, name, established, abolished, website, tours } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (t:Tournament {id: $id})
      SET t.name = $name, t.website = $website
      CALL (t) {
        WHEN $established IS NOT NULL THEN {
          MATCH (y:Year {id: $established})
          OPTIONAL MATCH (t)-[z:ESTABLISHED]->(y1:Year)
          CALL (*) {
            WHEN y1 IS NOT NULL AND y1.id <> y.id THEN DELETE z
          ELSE MERGE (t)-[:ESTABLISHED]->(y)
          }
        }
      }
      CALL (t) {
        WHEN $abolished IS NOT NULL THEN {
          MATCH (y:Year {id: $abolished})
          OPTIONAL MATCH (t)-[z:ABOLISHED]->(y1:Year)
          CALL (*) {
            WHEN y1 IS NOT NULL AND y1.id <> y.id THEN DELETE z
            ELSE MERGE (t)-[:ABOLISHED]->(y)
          }
        }
      }
      CALL (t) {
        WITH [x IN $tours WHERE NOT x IN labels(t)] AS add, [x IN labels(t) WHERE NOT x IN $tours AND x <> 'Tournament'] AS remove
        SET t:$(add) REMOVE t:$(remove)
      }
    `,
    {
      id: int(id),
      name: name || null,
      established: established ? int(established) : null,
      abolished: abolished ? int(abolished) : null,
      website: website || null,
      tours: tours ? (Array.isArray(tours) ? tours : [tours]) : []
    }
  )

  return summary
})
