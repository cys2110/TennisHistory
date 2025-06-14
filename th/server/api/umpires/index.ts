export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    sort: SortType
  }

  const { letter, skip, sort } = getQuery<QueryProps>(event)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (u:Umpire)
    WHERE toLower(u.last_name) STARTS WITH toLower($letter)
    WITH *
    ORDER BY toLower(u.last_name) ${sort ?? "ASC"}
    WITH CASE
      WHEN u IS NULL
        THEN null
      ELSE
        {
          id: u.id,
          name: u.first_name || ' ' || u.last_name
        }
      END AS umpire
    WITH COLLECT(umpire) AS all_umpires
    WITH all_umpires[toInteger($skip)..toInteger($skip) + 40] AS umpires, SIZE(all_umpires) AS count
    RETURN umpires, count
    `,
    { letter, skip }
  )

  const results = records[0].toObject()

  return {
    count: results.count.low,
    umpires: results.umpires.filter(Boolean)
  }
})
