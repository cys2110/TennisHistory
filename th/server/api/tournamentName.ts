export default defineEventHandler(async(query) => {
  const { id } = getQuery<{ id: string}>(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})-[:EDITION_OF]->(t:Tournament)
      RETURN t.name AS name
    `, {id: parseInt(id)}
  )

  const event = records.map((record) => record.toObject());

  return event[0].name;
})
