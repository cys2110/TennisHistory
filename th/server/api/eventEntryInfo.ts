export default defineEventHandler(async(query) => {
  const { eid } = getQuery<{ eid: string }>(query);

  const { records } = await useDriver().executeQuery(
    `/* cypher */
      MATCH (e:Event {id: $id})
      CALL(e) {
        OPTIONAL MATCH (e)<-[:LUCKY_LOSER]-(:Entry)-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        RETURN CASE
          WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT {
            id: p.id,
            name: p.first_name || ' ' || p.last_name,
            country: {
              id: c.id,
              name: c.name,
              alpha2: c.alpha2
            }
          })
          ELSE []
        END AS lls
      }
      CALL(e) {
        OPTIONAL MATCH (e)<-[:ALTERNATE]-(:Entry)-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        RETURN CASE
        WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT {
          id: p.id,
          name: p.first_name || ' ' || p.last_name,
          country: {
            id: c.id,
            name: c.name,
            alpha2: c.alpha2
          }
        })
        ELSE []
        END AS alts
      }
      CALL(e) {
        OPTIONAL MATCH (e)<-[t:WITHDREW]-(:Entry)-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        RETURN CASE
        WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT {
          id: p.id,
          name: p.first_name || ' ' || p.last_name,
          country: {
            id: c.id,
            name: c.name,
            alpha2: c.alpha2
          },
          reason: t.reason
        })
        ELSE []
        END AS wds
      }
      CALL(e) {
        OPTIONAL MATCH (e)<-[t:RETIRED]-(:Entry)-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        RETURN CASE
          WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT {
            id: p.id,
            name: p.first_name || ' ' || p.last_name,
            country: {
              id: c.id,
              name: c.name,
              alpha2: c.alpha2
            },
            reason: t.reason
          })
          ELSE []
        END AS rets
      }
      CALL(e) {
        OPTIONAL MATCH (e)<-[t:WALKOVER]-(:Entry)-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        RETURN CASE
          WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT {
            id: p.id,
            name: p.first_name || ' ' || p.last_name,
            country: {
              id: c.id,
              name: c.name,
              alpha2: c.alpha2
            },
            reason: t.reason
          })
          ELSE []
        END AS wos
      }
      CALL(e) {
        OPTIONAL MATCH (e)<-[:WILD_CARD]-(:Entry)-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        RETURN CASE
          WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT {
            id: p.id,
            name: p.first_name || ' ' || p.last_name,
            country: {
              id: c.id,
              name: c.name,
              alpha2: c.alpha2
            }
          })
          ELSE []
        END AS wcs
      }
      CALL(e) {
        OPTIONAL MATCH (e)<-[t:LDA]-(:Entry)-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        RETURN CASE
          WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT {
            id: p.id,
            name: p.first_name || ' ' || p.last_name,
            country: {
              id: c.id,
              name: c.name,
              alpha2: c.alpha2
            },
            rank: toString(t.rank),
            status: t.status
          })
          ELSE []
        END AS lda
      }
      CALL(e) {
        OPTIONAL MATCH (e)<-[:QUALIFIED]-(:Entry)-[:ENTERED]-(p:Player)-[:REPRESENTS]->(c:Country)
        RETURN CASE
          WHEN COUNT(p) > 0 THEN COLLECT(DISTINCT {
            id: p.id,
            name: p.first_name || ' ' || p.last_name,
            country: {
              id: c.id,
              name: c.name,
              alpha2: c.alpha2
            }
          })
          ELSE []
        END AS qs
      }
      WITH [
          {label: 'Withdrawals', content: wds},
          {label: 'Last Direct Acceptance', content: lda},
          {label: 'Lucky Losers', content: lls},
          {label: 'Alternates', content: alts},
          {label: 'Qualifiers', content: qs},
          {label: 'Wild Cards', content: wcs},
          {label: 'Retirements', content: rets},
          {label: 'Walkovers', content: wos}
      ] as result
      RETURN [entry in result WHERE entry.content <> []] as entryInfo
    `, { id: parseInt(eid) }
  );

  const event = records.map((record) => record.toObject());

  return event[0].entryInfo
})
