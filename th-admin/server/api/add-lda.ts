export default defineEventHandler(async event => {
  const { id, type, draw, rank, eid } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      MATCH (e:Event {id: toInteger($eid)})
      MATCH (f:Entry:$($type) {id: $id})
      CALL (*) {
        WHEN $draw = 'Main' THEN MERGE (f)-[:LDA {rank: toInteger($rank)}]->(e)
        ELSE MERGE (f)-[:Q_LDA {rank: toInteger($rank)}]->(e)
      }
      RETURN f
    `,
    {
      id,
      type,
      draw,
      rank,
      eid
    }
  )

  return summary
})
