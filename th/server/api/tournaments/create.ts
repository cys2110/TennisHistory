import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    id: string
    name: string
    established?: string
    abolished?: string
    website?: string
    tours: string[]
  }
  const { id, name, established, abolished, website, tours } = getQuery<QueryProps>(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MERGE (t:Tournament:$($tours) {id: $id, name: $name})
      SET t.website = $website
      CALL (t) {
        WHEN $established IS NOT NULL THEN {
          MATCH (y:Year {id: $established})
          MERGE (t)-[:ESTABLISHED]->(y)
        }
      }
      CALL (t) {
        WHEN $abolished IS NOT NULL THEN {
          MATCH (y:Year {id: $abolished})
          MERGE (t)-[:ABOLISHED]->(y)
        }
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

  if (summary.counters.updates().nodesCreated === 0) {
    throw createError({ statusCode: 400, statusMessage: "Tournament could not be created" })
  } else {
    return { ok: true }
  }
})
