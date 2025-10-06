export default defineEventHandler(async event => {
  const { search } = getQuery(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p:Player) WHERE p.first_name || ' ' || p.last_name =~ '(?i).*' + $search + '.*'
      RETURN {id: p.id, label: p.first_name || ' ' || p.last_name} AS player
      ORDER BY toLower(p.last_name), toLower(p.first_name)
      LIMIT 40
    `,
    { search }
  )

  return records.map(record => record.get("player"))
})
