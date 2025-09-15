export default defineEventHandler(async query => {
  const { searchTerm } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      CYPHER 25
      OPTIONAL MATCH (n:Player|Umpire|Coach|Supervisor) WHERE n.first_name || ' ' || n.last_name =~ '(?i).*' + $searchTerm + '.*'
      CALL (*) {
        WHEN n:Player THEN {
          OPTIONAL MATCH (n)-[:REPRESENTS]->(c:Country)
          RETURN apoc.map.merge(apoc.map.submap(n, ['id', 'first_name', 'last_name']), {country: properties(c), labels: [x IN labels(n) WHERE x IN ['Player', 'Umpire', 'Coach', 'Supervisor']]}) AS result
        }
        ELSE {
          RETURN apoc.map.merge(apoc.map.submap(n, ['id', 'first_name', 'last_name'], null, false), {labels: [x IN labels(n) WHERE x IN ['Player', 'Umpire', 'Coach', 'Supervisor']]}) AS result
        }
      }
      RETURN result

      UNION

      OPTIONAL MATCH (n:Tournament|Country) WHERE n.name =~ '(?i).*' + $searchTerm + '.*'
      RETURN apoc.map.merge(properties(n), {labels: [x IN labels(n) WHERE x IN ['Tournament', 'Country']]}) AS result

      UNION

      OPTIONAL MATCH (n:Surface|Venue) WHERE n.id =~ '(?i).*' + $searchTerm + '.*'
      CALL (*) {
        WHEN n:Surface THEN {
          RETURN apoc.map.merge(properties(n), {labels: ['Surface']}) AS result
        }
        ELSE {
          OPTIONAL MATCH (n)-[:LOCATED_IN]->(c:Country)
          RETURN apoc.map.merge(properties(n), {country: properties(c), labels: ['Venue']}) AS result
        }
      }
      RETURN result
    `,
    { searchTerm }
  )

  const results = records
    .map(record => record.get("result"))
    .filter(r => {
      if (r.labels === null) return false
      if (r.labels.includes("Venue") && !r.country) return false
      return true
    })

  return results
})
