export default defineEventHandler(async query => {
  const { search } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p:Player) WHERE p.first_name + ' ' + p.last_name =~ '(?i).*'+ $search + '.*'
      RETURN properties(p) AS player
      ORDER BY p.last_name
      LIMIT 40
    `,
    { search }
  )

  const results = records.map(r => {
    const player = r.get("player")
    return { id: player.id, label: player.first_name + " " + player.last_name }
  })

  return results
})
