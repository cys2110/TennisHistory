export default defineEventHandler(async event => {
  const { id, name, established, abolished, website, tours } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MERGE (t:Tournament {id: toInteger($id), name: $name})
      SET t.website = $website
      CALL (t) {
        WHEN $established IS NOT NULL THEN {
          MATCH (y:Year {id: toInteger($established)})
          MERGE (t)-[:ESTABLISHED]->(y)
        }
      }
      CALL (t) {
        WHEN $abolished IS NOT NULL THEN {
          MATCH (y:Year {id: toInteger($abolished)})
          MERGE (t)-[:ABOLISHED]->(y)
        }
      }
      CALL (t) {
        UNWIND $tours AS tour
        SET t:$(tour)
      }
    `,
    {
      id,
      name: name || null,
      established: established ?? null,
      abolished: abolished ?? null,
      website: website || null,
      tours: tours || []
    }
  )

  return summary
})
