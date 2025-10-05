export default defineEventHandler(async event => {
  const { id } = getQuery(event)

  const { summary } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: toInteger($id)})
      CALL (*) {
        WITH [['Q', 'QUALIFIED'], ['WC', 'WILD_CARD'], ['LL', 'LUCKY_LOSER'], ['AL', 'ALTERNATE']] AS statuses
        UNWIND statuses AS status
        OPTIONAL MATCH (f1:Entry {status: status[0]}) WHERE f1.id STARTS WITH toString(e.id)
        WITH e, f1, status
        WHERE f1 IS NOT NULL
        MERGE (f1)-[z:$(status[1])]->(e)
      }
      CALL (*) {
        WITH [['WC', 'Q_WILD_CARD'], ['AL', 'Q_ALTERNATE']] AS statuses
        UNWIND statuses AS status
        OPTIONAL MATCH (f1:Entry {q_status: status[0]}) WHERE f1.id STARTS WITH toString(e.id)
        WITH e, f1, status
        WHERE f1 IS NOT NULL
        MERGE (f1)-[z:$(status[1])]->(e)
      }
      RETURN *
    `,
    { id }
  )

  return summary
})
