export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})
      RETURN
      {
        tours: labels(e),
        atp_link: e.atp_link,
        wiki_link: e.wiki_link,
        wta_link: e.wta_link
      } AS event
    `,
    { id }
  )

  const results = records[0].get("event")

  return {
    ...results,
    tours: results.tours.filter((t: string) => t !== "Event")
  }
})
