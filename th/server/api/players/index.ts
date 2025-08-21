export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string | null
    pageSize: string
    page: string
    tour?: TourType
    active?: "Active" | "Inactive"
    country?: string
    min_year?: string[]
    max_year?: string[]
    first_name?: string | null
    last_name?: string | null
    sort_order?: any
  }

  const { letter, pageSize, first_name, last_name, page, sort_order, tour, active, country, min_year, max_year } = getQuery<QueryProps>(event)

  const currentYear = new Date().getFullYear()

  const formattedParams = {
    letter: letter ? letter.toLowerCase() : null,
    tour: tour ?? null,
    country: country ? country.toLowerCase() : null,
    first_name: first_name ? first_name.toLowerCase() : null,
    last_name: last_name ? last_name.toLowerCase() : null,
    active: active ?? null,
    min_year: min_year ? min_year.map(year => parseInt(year)) : null,
    max_year: max_year ? max_year.map(year => parseInt(year)) : null,
    currentYear,
    offset: (parseInt(page) - 1) * parseInt(pageSize),
    pageSize: parseInt(pageSize)
  }

  const getSortOption = () => {
    const sortOrder =
      Array.isArray(sort_order) ? sort_order.map(item => JSON.parse(item))
      : sort_order ? [JSON.parse(sort_order)]
      : []

    const typeMapping: Record<keyof (typeof sortOrder)[0], string> = {
      "First Name": "p.first_name",
      "Last Name": "p.last_name",
      Country: "c.name",
      "First Tournament Year": "min_year.value",
      "Last Tournament Year": "max_year.value"
    }

    if (sortOrder.length) {
      let baseSortOrder = sortOrder.map(order => `${typeMapping[order.type]} ${order.sort}`).join(", ")

      if (!baseSortOrder.includes("p.last_name")) {
        baseSortOrder += `, toLower(p.last_name)`
      }

      if (!baseSortOrder.includes("p.first_name")) {
        baseSortOrder += `, toLower(p.first_name)`
      }

      baseSortOrder += `, p.id`

      return baseSortOrder
    }
    return `toLower(p.last_name), toLower(p.first_name), p.id`
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    WITH coalesce($first_name, '') AS first_name, coalesce($last_name, '') AS last_name, $letter AS letter, coalesce($country, '') AS country

    CALL (first_name, last_name, letter, country) {
      MATCH (p:Player)-[:REPRESENTS]->(c:Country)
      WHERE (first_name = '' OR toLower(p.first_name) CONTAINS first_name)
        AND (last_name = '' OR toLower(p.last_name) CONTAINS last_name)
        AND (letter IS NULL OR toLower(p.last_name) STARTS WITH letter)
        AND ($tour IS NULL OR $tour IN labels(p))
        AND (country = '' OR toLower(c.name) CONTAINS country)
      OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (:Score)-[:SCORED]->
      (:Singles|Doubles)-[:PLAYED]->
      (:Round)-[:ROUND_OF]->
      (:Event)-[:IN_YEAR]->
      (y:Year)
      WITH p, apoc.agg.minItems(y, y.id) AS min_year, apoc.agg.maxItems(y, y.id) AS max_year
      WHERE ($min_year IS NULL OR (min_year.value >= $min_year[0] AND min_year.value <= $min_year[1])) AND ($max_year IS NULL OR (max_year.value >= $max_year[0] AND max_year.value <= $max_year[1])) AND ($active IS NULL OR ($active = 'Active' AND max_year.value = $currentYear) OR ($active = 'Inactive' AND (max_year IS NULL OR max_year.value < $currentYear)))
      RETURN count(p) AS total
    }

    CALL (first_name, last_name, letter, country) {
      MATCH (p:Player)-[:REPRESENTS]->(c:Country)
        WHERE (first_name = '' OR toLower(p.first_name) CONTAINS first_name)
        AND (last_name = '' OR toLower(p.last_name) CONTAINS last_name)
        AND (letter IS NULL OR toLower(p.last_name) STARTS WITH letter)
        AND ($tour IS NULL OR $tour IN labels(p))
        AND (country = '' OR toLower(c.name) CONTAINS country)
      OPTIONAL MATCH
      (p)-[:ENTERED]->
      (:Entry)-[:SCORED]->
      (:Score)-[:SCORED]->
      (:Singles|Doubles)-[:PLAYED]->
      (:Round)-[:ROUND_OF]->
      (:Event)-[:IN_YEAR]->
      (y:Year)
      WITH p, c, [x IN labels(p) WHERE NOT x IN ['Player', 'Coach', 'Update']][0] AS tour, apoc.agg.minItems(y, y.id) AS min_year, apoc.agg.maxItems(y, y.id) AS max_year
      WHERE ($min_year IS NULL OR (min_year.value >= $min_year[0] AND min_year.value <= $min_year[1])) AND ($max_year IS NULL OR (max_year.value >= $max_year[0] AND max_year.value <= $max_year[1])) AND ($active IS NULL OR ($active = 'Active' AND max_year.value = $currentYear) OR ($active = 'Inactive' AND (max_year IS NULL OR max_year.value < $currentYear)))
      ORDER BY ${getSortOption()}
      SKIP toInteger($offset)
      LIMIT toInteger($pageSize)
      RETURN apoc.map.clean(apoc.map.merge(properties(p), {country: properties(c), tour: tour, min_year: min_year.value, max_year: max_year.value}), [], [null]) AS player
    }

    RETURN player, total
    `,
    formattedParams
  )

  const results = records.map(record => record.toObject())

  for (const result of results) {
    result.total = result.total.toInt()

    result.player = {
      ...result.player,
      min_year: result.player.min_year?.toInt(),
      max_year: result.player.max_year?.toInt()
    }
  }

  return results
})
