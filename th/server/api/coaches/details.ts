export default defineEventHandler(async query => {
  const { id } = getQuery(query)

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH a = (d:Coach {id: $id})-[t:COACHES]->(p:Player)
      MATCH (p)-[:REPRESENTS]->(c:Country)
      OPTIONAL MATCH
        (p)-[:ENTERED]->
        (:Entry)-[:SCORED]->
        (s:Score)-[:SCORED]->
        (:Match)-[:PLAYED]->
        (r:Round)-[:ROUND_OF]->
        (e:Event)-[:IN_YEAR]->
        (y:Year)
      WITH *
      ORDER BY p.last_name
      WITH COLLECT(DISTINCT y.id) AS years, p, c, d, t
      WITH
        p,
        c,
        d,
        t,
        CASE
          WHEN years = [] THEN null
          ELSE apoc.coll.min(years)
        END AS min_year,
        CASE
          WHEN years = [] THEN null
          ELSE apoc.coll.max(years)
        END AS max_year
      WITH p, c, d, min_year, max_year, t
      CALL (p) {
        OPTIONAL MATCH
          (p)-[:ENTERED]->
          (:Entry)-[:SCORED]->
          (:Winner)-[:SCORED]->
          (:Match)-[:PLAYED]->
          (:Round {round: 'Final'})-[:ROUND_OF]->
          (e:Event {category: 'Grand Slam'})-[:IN_YEAR]->
          (y:Year)
        OPTIONAL MATCH (e)-[:EDITION_OF]->(x:Tournament)
        RETURN
          CASE
            WHEN
              e IS NOT NULL
              THEN {id: toString(e.id), year: toString(y.id), tournament: {id: toString(x.id), name: x.name}}
            ELSE null
          END AS gs_win
      }
      WITH p, c, d, t, min_year, max_year, COLLECT(gs_win) AS gs_wins
      RETURN
        {
          id: p.id,
          name: p.first_name + ' ' + p.last_name,
          country: {id: c.id, name: c.name, alpha2: c.alpha2},
          min_year: toString(min_year),
          max_year: toString(max_year),
          dob:
            CASE
              WHEN p.dob IS NOT NULL THEN apoc.temporal.format(p.dob, 'dd MMMM yyyy')
              ELSE null
            END,
          ch: toString(p.ch),
          ch_date:
            CASE
              WHEN
                p.ch_date IS NOT NULL
                THEN apoc.temporal.format(p.ch_date, 'dd MMMM yyyy')
              ELSE null
            END,
          gs: gs_wins,
          coach_start:
            CASE
              WHEN
                t.start_date IS NOT NULL
                THEN apoc.temporal.format(t.start_date, 'dd MMMM yyyy')
              ELSE null
            END,
          coach_end:
            CASE
              WHEN
                t.end_date IS NOT NULL
                THEN apoc.temporal.format(t.end_date, 'dd MMMM yyyy')
              ELSE null
            END
        } AS player,
        labels(d) AS labels,
        d.first_name || ' ' || d.last_name AS name
    `,
    { id }
  )

  const results = records.map(record => record.get("player"))
  const labels = records[0].get("labels")
  const name = records[0].get("name")
  return {
    players: results.map(r => ({
      ...r,
      min_year: Number(r.min_year),
      max_year: Number(r.max_year)
    })),
    labels,
    name
  }
})
