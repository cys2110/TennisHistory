export default defineEventHandler(async event => {
  const { letter } = getQuery<{ letter: string }>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    WITH $letter AS letter

    CALL (letter) {
      MATCH (c:Coach)
      WHERE toLower(c.last_name) STARTS WITH letter
      RETURN count(c) AS total
    }

    CALL (letter) {
      MATCH (c:Coach WHERE c.last_name IS NOT NULL)
      WHERE toLower(c.last_name) STARTS WITH letter
      WITH c
      ORDER BY toLower(c.last_name), toLower(c.first_name), c.id
      RETURN DISTINCT apoc.map.submap(c, ['id', 'first_name', 'last_name']) AS coach
    }

    RETURN coach, total
    `,
    { letter: letter ? letter.toLowerCase() : null }
  )

  const results = records.map(record => record.toObject())

  for (const result of results) {
    result.total = result.total.toInt()
  }

  return results
})
