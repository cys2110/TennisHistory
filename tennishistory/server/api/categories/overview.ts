export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      WITH apoc.text.clean($id) AS category, ['category','atp_category','wta_category','men_category','women_category'] AS props
      MATCH (e:Event)-[:EDITION_OF]->(:Tournament)
      WITH category, [p IN props | e[p]] AS cats
      WITH [c IN cats WHERE c IS NOT NULL AND apoc.text.clean(c) = category] AS matches
      WHERE size(matches) > 0
      RETURN head(matches) AS category
      LIMIT 1
    `,
    { id }
  )

  const results = records[0].get("category")

  return results
})
