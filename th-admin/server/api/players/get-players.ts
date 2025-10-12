export default defineEventHandler(async query => {
  const { letter } = getQuery<{ letter: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      WHEN $letter = 'Update' THEN {
        MATCH (p:Player WHERE p.first_name IS NULL)
        RETURN {id: p.id, labels: labels(p)} AS player
        ORDER BY player.id
      } ELSE {
        MATCH (p:Player WHERE toLower(p.last_name) STARTS WITH toLower($letter))
        RETURN apoc.map.merge(apoc.map.submap(p, ['id', 'first_name', 'last_name'], null, false), {labels: labels(p)}) AS player
        ORDER BY toLower(p.last_name), toLower(p.first_name)
      }
    `,
    { letter }
  )

  const result = records.map(record => record.get("player"))

  return result
})
