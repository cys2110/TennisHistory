export default defineEventHandler(async event => {
  interface QueryProps {
    letter: string
    skip: string
    nameSort: SortType
    establishedSort: SortType
    abolishedSort: SortType
  }

  const { letter, skip, nameSort, establishedSort, abolishedSort } = getQuery<QueryProps>(event)

  const sortBy =
    establishedSort ? `e.id ${establishedSort}, t.name`
    : abolishedSort ? `a.id ${abolishedSort}, t.name`
    : `t.name ${nameSort ?? "ASC"}`

  const { records } = await useDriver().executeQuery(
    `/* cypher */
    MATCH (t:Tournament) WHERE t.name STARTS WITH $letter
    OPTIONAL MATCH (t)-[:ESTABLISHED]->(e:Year)
    OPTIONAL MATCH (t)-[:ABOLISHED]->(a:Year)
    WITH *
    ORDER BY ${sortBy}
    WITH CASE
      WHEN t IS NULL
        THEN null
      ELSE
        {
          id: t.id,
          name: t.name,
          tours: labels(t),
          established: e.id,
          abolished: a.id
        }
      END AS tournament
    WITH COLLECT(tournament) AS all_tournaments
    WITH all_tournaments[toInteger($skip)..toInteger($skip) + 40] AS tournaments, SIZE(all_tournaments) AS count
    RETURN tournaments, count
    `,
    { letter, skip }
  )

  const results = records[0].toObject()

  // TODO: Remove "Update"
  return {
    count: results.count.low,
    tournaments: results.tournaments.filter(Boolean).map((tournament: any) => ({
      ...tournament,
      id: tournament.id.low,
      established: tournament.established?.low,
      abolished: tournament.abolished?.low,
      tours: tournament.tours.filter((tour: string) => tour !== "Tournament" && tour !== "Update")
    }))
  }
})
