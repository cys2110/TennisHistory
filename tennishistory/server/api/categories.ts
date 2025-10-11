export default defineEventHandler(async event => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (e:Event)
    WITH apoc.coll.toSet(apoc.coll.flatten(COLLECT([e.category, e.atp_category, e.wta_category, e.men_category, e.women_category]))) AS categories
    UNWIND categories AS category
    RETURN category
    ORDER BY category
    `
  )

  return records.map(r => r.get("category")).filter(Boolean)
})
