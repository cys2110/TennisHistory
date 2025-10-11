export default defineEventHandler(async event => {
  const { search } = getQuery(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (t:Tournament) WHERE t.name =~ '(?i).*' + $search + '.*'
      RETURN { id: t.id, label: t.name } AS tournament
      ORDER BY toLower(t.name)
      LIMIT 40
    `,
    {
      search
    }
  )

  const results = records.map(record => {
    const tournament = record.get("tournament")
    tournament["id"] = tournament["id"].toInt()
    return tournament
  })

  return results
})
