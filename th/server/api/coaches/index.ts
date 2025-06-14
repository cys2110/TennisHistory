export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    sort: SortType
  }

  const { letter, skip, sort } = getQuery<QueryProps>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (c:Coach)
    WHERE toLower(c.last_name) STARTS WITH toLower($letter)
    WITH *
    ORDER BY toLower(c.last_name) ${sort ?? "ASC"}
    WITH CASE
      WHEN c IS NULL
        THEN null
      ELSE
        {
          id: c.id,
          name: c.first_name || ' ' || c.last_name
        }
      END AS coach
    WITH COLLECT(coach) AS all_coaches
    WITH all_coaches[toInteger($skip)..toInteger($skip) + 40] AS coaches, SIZE(all_coaches) AS count
    RETURN coaches, count
    `,
    { letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: results.count.low,
    coaches: results.coaches.filter(Boolean)
  }
})
