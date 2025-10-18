export default defineEventHandler(async query => {
  const { search } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (s:Supervisor) WHERE s.id =~ '(?i).*'+ $search + '(?i).*'
      RETURN properties(s) AS supervisor
      ORDER BY supervisor.last_name
      LIMIT 40
    `,
    { search }
  )

  const results = records.map(r => {
    const supervisor = r.get("supervisor")
    return { id: supervisor.id, label: supervisor.id }
  })

  return results
})
