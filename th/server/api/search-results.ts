export default defineEventHandler(async query => {
  const { searchTerm } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      OPTIONAL MATCH (n) WHERE n.first_name || ' ' || n.last_name =~ '(?i).*' + $searchTerm + '.*' OR n.id =~ '(?i).*' + $searchTerm + '.*' OR n.name =~ '(?i).*' + $searchTerm + '.*' OR n.city =~ '(?i).*' + $searchTerm + '.*'
      OPTIONAL MATCH (n)-[:LOCATED_IN]->(c1:Country) WHERE 'Venue' IN labels(n)
      OPTIONAL MATCH (c2:Country)<-[:REPRESENTS]-(n)-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y:Year) WHERE 'Player' IN labels(n)
      OPTIONAL MATCH (c3:Country)<-[:REPRESENTS]-(n)-[:ENTERED]->(:Entry)-[:WITHDREW]->(:Event)-[:IN_YEAR]->(y2:Year) WHERE 'Player' IN labels(n)
      OPTIONAL MATCH (c4:Country)<-[:REPRESENTS]-(n)-[:ENTERED]->(:Entry)-[:SCORED]->(:T1|T2)-[:SCORED]->(:Doubles)-[:PLAYED]->(:Tie)-[:TIE_OF]->(:Round)-[:ROUND_OF]->(:Event)-[:IN_YEAR]->(y3:Year) WHERE 'Player' IN labels(n)

      WITH n, c1, min(y.id) AS min, max(y.id) AS max, c2, c3, min(y2.id) AS min2, max(y2.id) AS max2, c4, min(y3.id) AS min3, max(y3.id) AS max3

      RETURN {
        labels: labels(n),
        country: CASE
          WHEN c1 IS NOT NULL THEN {id: c1.id, name: c1.name, alpha2: c1.alpha2}
          WHEN c2 IS NOT NULL THEN {id: c2.id, name: c2.name, alpha2: c2.alpha2}
          WHEN c3 IS NOT NULL THEN {id: c3.id, name: c3.name, alpha2: c3.alpha2}
          WHEN c4 IS NOT NULL THEN {id: c4.id, name: c4.name, alpha2: c4.alpha2}
          ELSE NULL
        END,
        min_year: CASE WHEN min IS NOT NULL THEN toString(min) WHEN min2 IS NOT NULL THEN toString(min2) WHEN min3 IS NOT NULL THEN toString(min3) ELSE NULL END,
        max_year: CASE WHEN max IS NOT NULL THEN toString(max) WHEN max2 IS NOT NULL THEN toString(max2) WHEN max3 IS NOT NULL THEN toString(max3) ELSE NULL END,
        name: CASE WHEN n.name IS NOT NULL THEN n.name ELSE n.first_name || ' ' || n.last_name END,
        city: n.city,
        id: toString(n.id),
        alpha2: n.alpha2
      } AS results
    `,
    { searchTerm }
  )

  const resultsObject = records.map(record => record.toObject().results)
  const results = resultsObject.map((result: any) => ({
    ...result,
    max_year: result.max_year ? Number(result.max_year) : null,
    min_year: result.min_year ? Number(result.min_year) : null
  }))

  // Get unique labels for tab display on FE
  const categories = results.reduce((acc: string[], result) => {
    result.labels.forEach((label: string) => {
      if (!acc.includes(label)) {
        acc.push(label)
      }
    })
    return acc
  }, [])

  return { results, categories }
})
