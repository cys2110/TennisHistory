export default defineEventHandler(async query => {
  const { skip, envSort, surfaceSort } = getQuery(query)

  let sort = "s.surface, s.environment"

  if (envSort) {
    if (envSort === "ASC") sort = "s.environment, s.surface"
    if (envSort === "DESC") sort = "s.environment DESC, s.surface"
  } else if (surfaceSort && surfaceSort === "DESC") {
    sort = "s.surface DESC, s.environment"
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (s:Surface)
      WITH s
        ORDER BY ${sort}
      WITH {id: s.id, environment: s.environment, surface: s.surface} AS surface
      WITH COLLECT(surface) AS all, COUNT(surface) AS count
      WITH all[toInteger($skip)..toInteger($skip) + 25] AS surfaces, count
      RETURN toString(count) AS count, surfaces
    `,
    { skip }
  )

  const count = records[0].get("count")
  const surfaces = records[0].get("surfaces")

  return {
    count: Number(count),
    surfaces: surfaces
  }
})
