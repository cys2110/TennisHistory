export default defineEventHandler(async (query) => {
  const { eid } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (e:Event {id: $id})
        OPTIONAL MATCH (e)<-[:LUCKY_LOSER]-(:Entry)-[:ENTERED]-(ll:Player)-[:REPRESENTS]->(llc:Country)
        OPTIONAL MATCH (e)<-[:ALTERNATE]-(:Entry)-[:ENTERED]-(alt:Player)-[:REPRESENTS]->(altc:Country)
        OPTIONAL MATCH (e)<-[wdt:WITHDREW]-(:Entry)-[:ENTERED]-(wd:Player)-[:REPRESENTS]->(wdc:Country)
        OPTIONAL MATCH (e)<-[rett:RETIRED]-(:Entry)-[:ENTERED]-(ret:Player)-[:REPRESENTS]->(retc:Country)
        OPTIONAL MATCH (e)<-[wot:WALKOVER]-(:Entry)-[:ENTERED]-(wo:Player)-[:REPRESENTS]->(woc:Country)
        OPTIONAL MATCH (e)<-[:WILD_CARD]-(:Entry)-[:ENTERED]-(wc:Player)-[:REPRESENTS]->(wcc:Country)
        OPTIONAL MATCH (e)<-[ldat:LDA]-(:Entry)-[:ENTERED]-(lda:Player)-[:REPRESENTS]->(ldac:Country)
        OPTIONAL MATCH (e)<-[:QUALIFIED]-(:Entry)-[:ENTERED]-(q:Player)-[:REPRESENTS]->(qc:Country)
        WITH CASE WHEN COUNT(ll) > 0 THEN COLLECT(DISTINCT({id: ll.id, name: ll.first_name + ' ' + ll.last_name, country: llc.id})) ELSE [] END AS lls,
        CASE WHEN COUNT(alt) > 0 THEN COLLECT(DISTINCT({id: alt.id, name: alt.first_name + ' ' + alt.last_name, country: altc.id})) ELSE [] END AS alts,
        CASE WHEN COUNT(wc) > 0 THEN COLLECT(DISTINCT({id: wc.id, name: wc.first_name + ' ' + wc.last_name, country: wcc.id})) ELSE [] END AS wcs,
        CASE WHEN COUNT(q) > 0 THEN COLLECT(DISTINCT({id: q.id, name: q.first_name + ' ' + q.last_name, country: qc.id})) ELSE [] END AS qs,
        CASE WHEN COUNT(lda) > 0 THEN COLLECT(DISTINCT({id: lda.id, name: lda.first_name + ' ' + lda.last_name, country: ldac.id, rank: ldat.rank})) ELSE [] END AS lda,
        CASE WHEN COUNT(wd) > 0 THEN COLLECT(DISTINCT({id: wd.id, name: wd.first_name + ' ' + wd.last_name, country: wdc.id, reason: wdt.reason})) ELSE [] END AS wds,
        CASE WHEN COUNT(ret) > 0 THEN COLLECT(DISTINCT({id: ret.id, name: ret.first_name + ' ' + ret.last_name, country: retc.id, reason: rett.reason})) ELSE [] END AS rets,
        CASE WHEN COUNT(wo) > 0 THEN COLLECT(DISTINCT({id: wo.id, name: wo.first_name + ' ' + wo.last_name, country: woc.id, reason: wot.reason})) ELSE [] END AS wos
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
      `,
    { id: parseInt(eid) }
  );

  const event = records.map((record) => record.toObject());

  return event[0].entryInfo;
});
