export default defineEventHandler(async (query) => {
  const { id } = getQuery<{ id: string}>(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})-[:EDITION_OF]->(t:Tournament)
      RETURN {
        name: t.name
      } AS name
    `, {id: parseInt(id)}
  )

  const event = records.map((record) => record.toObject());
  console.log(event[0])

  return event[0].name;
})
