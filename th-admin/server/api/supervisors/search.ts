export default defineEventHandler(async event => {
  const { search } = getQuery(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (s:Supervisor) WHERE s.id =~ '(?i).*' + $search + '.*'
      RETURN s.id AS supervisor
      ORDER BY toLower(s.id)
      LIMIT 40
    `,
    {
      search
    }
  )

  const results = records.map(record => record.get("supervisor"))

  return results
})
