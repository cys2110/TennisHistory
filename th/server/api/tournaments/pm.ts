export default defineEventHandler(async query => {
  const { id } = getQuery<{ id: string }>(query)

  const { records: roundRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)-[:IN_YEAR]->(y:Year)
      WITH e, y.id AS year, [x IN labels(e) WHERE NOT x IN ['Update', 'Event']] AS tours
      UNWIND tours AS tour
      OPTIONAL MATCH (e)<-[:ROUND_OF]-(singles:Round:$(tour):Singles)
      OPTIONAL MATCH (e)<-[:ROUND_OF]-(doubles:Round:$(tour):Doubles)

      WITH year, e.id AS id, tour, CASE WHEN e.currency IS NOT NULL THEN e.currency WHEN tour = 'ATP' THEN e.atp_currency WHEN tour = 'WTA' THEN e.wta_currency WHEN tour = 'Men' THEN e.men_currency ELSE e.women_currency END AS currency, singles, doubles
      WITH apoc.map.merge(apoc.any.properties(singles), {year: year, id: id, tour: tour, currency: currency, type: 'Singles'}) AS singles, apoc.map.merge(apoc.any.properties(doubles), {year: year, id: id, tour: tour, currency: currency, type: 'Doubles'}) AS doubles
      RETURN apoc.coll.unionAll(COLLECT(singles), COLLECT(doubles)) AS results
    `,
    { id: Number(id) }
  )

  const { records: pmRecords } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (:Tournament {id: $id})<-[:EDITION_OF]-(e:Event)-[:IN_YEAR]->(y:Year)
      WITH
        e,
        y.id AS year,
        [x IN labels(e) WHERE NOT x IN ['Update', 'Event']] AS tours
      UNWIND tours AS tour

      WITH
        year,
        e.id AS id,
        tour,
        CASE
          WHEN e.currency IS NOT NULL THEN e.currency
          WHEN tour = 'ATP' THEN e.atp_currency
          WHEN tour = 'WTA' THEN e.wta_currency
          WHEN tour = 'Men' THEN e.men_currency
          ELSE e.women_currency
        END AS currency,
        CASE
          WHEN e.pm IS NOT NULL THEN e.pm
          WHEN tour = 'ATP' THEN e.atp_pm
          WHEN tour = 'WTA' THEN e.wta_tfc
          WHEN tour = 'Men' THEN e.men_pm
          ELSE e.women_pm
        END AS pm
      RETURN {year: year, id: id, tour: tour, currency: currency, pm: pm} AS results
    `
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
