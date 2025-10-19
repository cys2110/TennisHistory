import { int } from "neo4j-driver"

export default defineEventHandler(async event => {
  interface QueryProps {
    skip: string
    filters: any
  }

  const { skip, filters } = getQuery<QueryProps>(event)

  const { tours, tournaments, established, abolished } = JSON.parse(filters)

  const formattedParams = {
    skip: int(skip),
    tours: tours.map((t: any) => (typeof t === "string" ? t : t.value)),
    tournaments: tournaments.map((t: any) => int(t.id)),
    established: established ? int(established) : null,
    abolished: abolished ? int(abolished) : null
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    CALL () {
      MATCH (t:Tournament)
        WHERE (SIZE($tours) = 0 OR ANY(x IN $tours WHERE x IN labels(t)))
        AND (SIZE($tournaments) = 0 OR t.id IN $tournaments)
        AND ($established IS NULL OR
          EXISTS {
            MATCH (t)-[:ESTABLISHED]->(:Year {id: $established})
          })
        AND ($abolished IS NULL OR
          EXISTS {
            MATCH (t)-[:ABOLISHED]->(:Year {id: $abolished})
          })
      RETURN COUNT(t) AS count
    }
    CALL () {
      MATCH (t:Tournament)
        WHERE (SIZE($tours) = 0 OR ANY(x IN $tours WHERE x IN labels(t)))
        AND (SIZE($tournaments) = 0 OR t.id IN $tournaments)
      CALL (t) {
        OPTIONAL MATCH (t)-[:ESTABLISHED]->(e:Year)
        OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
        RETURN e.id AS established, a.id AS abolished
      }
      WITH t, established, abolished, CASE WHEN t:Update THEN true ELSE false END AS update
        WHERE ($established IS NULL OR established = $established)
        AND ($abolished IS NULL OR abolished = $abolished)
      ORDER BY t.name
      SKIP $skip
      LIMIT 40
      RETURN apoc.map.clean(apoc.map.merge(properties(t), {established: established, abolished: abolished, tours: [x IN labels(t) WHERE NOT x IN ['Tournament', 'Update']], update: update}) , [], [null]) AS tournament
    }
    RETURN count, tournament
    `,
    formattedParams
  )

  const results = records.map(record => {
    const tournament = record.get("tournament")
    const numberKeys = ["id", "established", "abolished"]

    for (const key of numberKeys) {
      if (tournament[key]) {
        tournament[key] = tournament[key].toInt()
      }
    }

    return tournament
  })

  return {
    count: records[0].get("count").toInt(),
    tournaments: results
  }
})
