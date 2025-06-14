export default defineEventHandler(async query => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event)
      UNWIND [e.category, e.atp_category, e.wta_category] AS cat
      WITH DISTINCT cat WHERE cat IS NOT NULL
      RETURN apoc.coll.sort(collect(cat)) AS categories
    `
  )

  const results = records[0].toObject()

  return results.categories
})
