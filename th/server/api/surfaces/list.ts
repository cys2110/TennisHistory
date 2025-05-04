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
      WITH COLLECT(s) AS all, COUNT(s) AS count
      WITH all[toInteger($skip)..toInteger($skip) + 25] AS sliced, count
      UNWIND CASE WHEN sliced = [] THEN [null] ELSE sliced END AS s
      RETURN toString(count) AS count,
      CASE
        WHEN s IS NOT NULL THEN {id: s.id, environment: s.environment, surface: s.surface}
        ELSE NULL
      END AS surface
    `,
    { skip }
  )

  const count = records[0].get("count")
  const surfaces = records.map(record => record.get("surface"))

  return {
    count: Number(count),
    surfaces: surfaces.filter(supervisor => supervisor !== null)
  }
})
