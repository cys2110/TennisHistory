export default defineEventHandler(async event => {
  const { search } = getQuery(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (p:Coach) WHERE p.first_name || ' ' || p.last_name =~ '(?i).*' + $search + '.*'
      RETURN {id: p.id, label: p.first_name || ' ' || p.last_name} AS coach
      ORDER BY toLower(p.last_name), toLower(p.first_name)
      LIMIT 40
    `,
    {
      search
    }
  )

  const results = records.map(record => {
    const coach = record.get("coach")

    return {
      ...coach,
      label: `${coach.first_name} ${coach.last_name}`
    }
  })

  return records.map(record => record.get("coach"))
})
