export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)<-[:ROUND_OF]-(r:Round)
      MATCH (e)-[:IN_YEAR]->(y:Year)

      WITH y.id AS year, e.currency AS currency,
          COLLECT({round: r.round, pm: r.pm}) AS rounds,
          CASE
            WHEN e.pm IS NOT NULL THEN e.pm
            WHEN e.tfc IS NOT NULL THEN e.tfc
            ELSE 0
          END AS pm

      WITH year, pm, currency,
          REDUCE(r128 = NULL, x IN rounds | CASE WHEN x.round = 'Round of 128' THEN x ELSE r128 END) AS r128,
          REDUCE(r64 = NULL,  x IN rounds | CASE WHEN x.round = 'Round of 64'  THEN x ELSE r64 END)  AS r64,
          REDUCE(r32 = NULL,  x IN rounds | CASE WHEN x.round = 'Round of 32'  THEN x ELSE r32 END)  AS r32,
          REDUCE(r16 = NULL,  x IN rounds | CASE WHEN x.round = 'Round of 16'  THEN x ELSE r16 END)  AS r16,
          REDUCE(qf = NULL,   x IN rounds | CASE WHEN x.round = 'Quarterfinals' THEN x ELSE qf END) AS qf,
          REDUCE(sf = NULL,   x IN rounds | CASE WHEN x.round = 'Semifinals'   THEN x ELSE sf END)  AS sf,
          REDUCE(final = NULL,x IN rounds | CASE WHEN x.round = 'Final'       THEN x ELSE final END) AS final

      ORDER BY year

      RETURN {
        year: year,
        currency: currency,
        pm: pm,
        R128: CASE WHEN r128 IS NULL THEN null ELSE r128.pm END,
        R64:  CASE WHEN r64 IS NULL  THEN null ELSE r64.pm  END,
        R32:  CASE WHEN r32 IS NULL  THEN null ELSE r32.pm  END,
        R16:  CASE WHEN r16 IS NULL  THEN null ELSE r16.pm  END,
        QF:   CASE WHEN qf IS NULL   THEN null ELSE qf.pm   END,
        SF:   CASE WHEN sf IS NULL   THEN null ELSE sf.pm   END,
        F:CASE WHEN final IS NULL THEN null ELSE final.pm END
      } AS round_data
    `,
    { id: Number(id) }
  )

  const results = records.map(record => record.toObject().round_data)

  const numberResults = results.map(result => {
    for (const [key, value] of Object.entries(result)) {
      if (value === null || value === undefined) {
        delete result[key]
      } else if (typeof value === "object") {
        // @ts-ignore
        result[key] = value.low
      } else {
        result[key] = value
      }
    }

    return result
  })

  const dataWithYoY = numberResults.map((row, i, arr) => {
    if (i === 0 || !arr[i - 1]?.pm) return { ...row, yoy: "—" }

    const prevPm = arr[i - 1].pm
    const currPm = row.pm

    const yoy = prevPm ? ((currPm - prevPm) / prevPm) * 100 : null

    return {
      ...row,
      yoy: yoy?.toFixed(1) + "%" // e.g. "12.3%"
    }
  })

  return dataWithYoY
})
