export default defineEventHandler(async query => {
  const { searchTerm } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (n) WHERE n.first_name || ' ' || n.last_name =~ '(?i).*' + $searchTerm + '.*' OR n.id =~ '(?i).*' + $searchTerm + '.*' OR n.name =~ '(?i).*' + $searchTerm + '.*' OR n.city =~ '(?i).*' + $searchTerm + '.*'
      RETURN *
    `,
    { searchTerm }
  )

  const results = records.map(record => record.toObject())

  const transformedResults = results.map(result => {
    return {
      labels: result.n.labels,
      properties: result.n.properties
    }
  })

  const categories = transformedResults.reduce((acc: string[], result) => {
    result.labels.forEach((label: string) => {
      if (!acc.includes(label)) {
        acc.push(label)
      }
    })
    return acc
  }, [])

  return { results: transformedResults, categories }
})
