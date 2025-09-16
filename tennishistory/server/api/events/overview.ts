export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})-[:EDITION_OF]->(t:Tournament)
      WITH e, [x in labels(e) WHERE NOT x IN ['Event', 'Update']] AS tours, t
      RETURN
      {
        tournament: apoc.map.submap(t, ['id', 'name']),
        tours: tours,
        atp_link: e.atp_link,
        wiki_link: e.wiki_link,
        wta_link: e.wta_link,
        men_link: e.men_link,
        women_link: e.women_link
      } AS event
    `,
    { id }
  )

  const results = records[0].get("event")

  return results
})
