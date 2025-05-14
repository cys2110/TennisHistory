export default defineEventHandler(async query => {
  interface QueryProps {
    envSort: "ASC" | "DESC" | undefined
    skip: string
    surfaceSort: "ASC" | "DESC" | undefined
  }

  const { envSort, skip, surfaceSort } = getQuery<QueryProps>(query)

  const sort = envSort ? `s.environment ${envSort}, s.surface` : `s.surface ${surfaceSort}, s.environment`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface)
      WITH s
        ORDER BY ${sort}
      WITH CASE
        WHEN s IS NULL THEN NULL
        ELSE {id: s.id, environment: s.environment, surface: s.surface}
      END AS surface
      WITH COLLECT(surface) AS surfaces, COUNT(surface) AS count
      WITH surfaces[toInteger($skip)..toInteger($skip) + 25] AS surfaces, count
      RETURN toString(count) AS count, surfaces
    `,
    { skip }
  )

  const results = records[0].toObject()

  return {
    count: Number(results.count),
    surfaces: results.surfaces.filter(Boolean)
  }
})
