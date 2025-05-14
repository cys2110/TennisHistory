export default defineEventHandler(async query => {
  interface QueryProps {
    skip: string
    sort: "ASC" | "DESC"
  }

  const { skip, sort } = getQuery<QueryProps>(query)

  const sortOption = sort === "ASC" ? "e.category ASC" : "e.category DESC"

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event)
      WHERE e.category IS NOT NULL
      WITH DISTINCT e.category AS category
      ORDER BY ${sortOption}
      WITH collect(category) AS categories
      WITH SIZE(categories) AS count, categories[toInteger($skip)..toInteger($skip) + 25] AS categories
      RETURN toString(count) AS count, categories
    `,
    { skip }
  )

  const results = records[0].toObject()

  return { count: Number(results.count), categories: results.categories.filter(Boolean) }
})
