export default defineEventHandler(async query => {
  const { letter } = getQuery<{ letter: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      WHEN $letter = 'Update' THEN {
        MATCH (p:Coach WHERE p.first_name IS NULL)
        RETURN {id: p.id} AS coach
        ORDER BY coach.id
      } ELSE {
        MATCH (p:Coach WHERE toLower(p.last_name) STARTS WITH toLower($letter))
        RETURN apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false) AS coach
        ORDER BY toLower(p.last_name), toLower(p.first_name)
      }
    `,
    { letter }
  )

  const result = records.map(record => record.get("coach"))

  return result
})
