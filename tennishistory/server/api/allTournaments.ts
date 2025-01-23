export default defineEventHandler(async(query) => {
  const { letter, skip } = getQuery<{letter: string, skip: string}>(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament) WHERE $letter IS NULL OR t.name STARTS WITH $letter
      WITH t
      ORDER BY t.name
      SKIP toInteger($skip)
      LIMIT 24
      RETURN COLLECT({id: toString(t.id), name: t.name}) AS tournaments
    `, { letter: letter === 'All' ? null : letter, skip }
  )

  const results = records.map((record) => record.toObject());

  const { records: count } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (t:Tournament) WHERE $letter IS NULL OR t.name STARTS WITH $letter
      RETURN COUNT(t) AS count
    `, { letter: letter === 'All' ? null : letter }
  )

  const countResults = count.map((record) => record.toObject());

  return {count: countResults[0].count, tournaments: results[0].tournaments}
})
