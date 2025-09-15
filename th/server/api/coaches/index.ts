export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string | null
    pageSize: string
    page: string
    first_name?: string | null
    last_name?: string | null
    sort_order?: any
  }

  const { letter, pageSize, first_name, last_name, page, sort_order } = getQuery<QueryProps>(event)

  const formattedParams = {
    letter: letter ? letter.toLowerCase() : null,
    first_name: first_name ? first_name.toLowerCase() : null,
    last_name: last_name ? last_name.toLowerCase() : null,
    offset: (parseInt(page) - 1) * parseInt(pageSize),
    pageSize: parseInt(pageSize)
  }

  const getSortOption = () => {
    const sortOrder =
      Array.isArray(sort_order) ? sort_order.map(item => JSON.parse(item))
      : sort_order ? [JSON.parse(sort_order)]
      : []

    if (sortOrder.length) {
      if (sortOrder[0].type === "First Name") {
        return `toLower(c.first_name) ${sortOrder[0].sort}, toLower(c.last_name) ${sortOrder[1]?.sort ?? "ASC"}, c.id`
      } else {
        return `toLower(c.last_name) ${sortOrder[0].sort}, toLower(c.first_name) ${sortOrder[1]?.sort ?? "ASC"}, c.id`
      }
    }
    return `toLower(c.last_name), toLower(c.first_name), c.id`
  }

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    WITH coalesce($first_name, '') AS first_name, coalesce($last_name, '') AS last_name, $letter AS letter

    CALL (first_name, last_name, letter) {
      MATCH (c:Coach)
      WHERE (first_name = '' OR toLower(c.first_name) CONTAINS first_name) AND (last_name = '' OR toLower(c.last_name) CONTAINS last_name) AND (letter IS NULL OR toLower(c.last_name) STARTS WITH letter)
      RETURN count(c) AS total
    }

    CALL (first_name, last_name, letter) {
      MATCH (c:Coach WHERE c.last_name IS NOT NULL)
      WHERE (first_name = '' OR toLower(c.first_name) CONTAINS first_name) AND (last_name = '' OR toLower(c.last_name) CONTAINS last_name) AND (letter IS NULL OR toLower(c.last_name) STARTS WITH letter)
      WITH c
      ORDER BY ${getSortOption()}
      SKIP toInteger($offset)
      LIMIT toInteger($pageSize)
      RETURN DISTINCT apoc.map.submap(c, ['id', 'first_name', 'last_name']) AS coach
    }

    RETURN coach, total
    `,
    formattedParams
  )

  const results = records.map(record => record.toObject())

  for (const result of results) {
    result.total = result.total.toInt()
  }

  return results
})
