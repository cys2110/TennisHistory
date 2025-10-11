export default defineEventHandler(async event => {
  const { search } = getQuery(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (u:Umpire) WHERE u.id =~ '(?i).*' + $search + '.*'
      RETURN u.id AS umpire
      ORDER BY toLower(u.id)
      LIMIT 40
    `,
    {
      search
    }
  )

  const results = records.map(record => record.get("umpire"))

  return results
})
