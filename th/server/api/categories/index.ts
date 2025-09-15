export default defineEventHandler(async () => {
  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event)
      UNWIND [e.category, e.atp_category, e.wta_category, e.men_category, e.women_category] AS category
      WITH DISTINCT category WHERE category IS NOT NULL
      RETURN category
      ORDER BY category
    `
  )

  const results = records.map(r => {
    const category = r.get("category")

    return {
      category: category,
      tour:
        ATP_CATEGORIES.includes(category) ? "ATP"
        : WTA_CATEGORIES.includes(category) ? "WTA"
        : ITF_MEN_CATEGORIES.includes(category) ? "ITF (M)"
        : ITF_WOMEN_CATEGORIES.includes(category) ? "ITF (W)"
        : undefined,
      level:
        CHALLENGER_CATEGORIES.includes(category) ? "Challenger"
        : ITF_MEN_CATEGORIES.includes(category) || ITF_WOMEN_CATEGORIES.includes(category) ? "ITF"
        : "Tour"
    }
  })

  return results
})
