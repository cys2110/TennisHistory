export default defineEventHandler(async (event) => {
    const { year, pid } = getQuery<{ year: string; pid: string }>(event);

    const formattedParams = {
        id: pid,
        year: parseInt(year)
    };

    const { records } = await useDriver().executeQuery(
        `
        MATCH (p:Player {id: $id})-[:ENTERED]->(f:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(m:Match)-[:PLAYED]->(r:Round)-[:ROUND_OF]->(e:Event)-[:TOOK_PLACE_IN]->(y:Year {id: $year})
        WITH sum(CASE WHEN s:Winner AND m.incomplete IS NULL THEN 1 ELSE 0 END) AS wins, sum(CASE WHEN s:Loser AND m.incomplete IS NULL THEN 1 ELSE 0 END) AS losses, sum(CASE WHEN s:Winner AND r.round = 'Final' THEN 1 ELSE 0 END) AS titles
        RETURN [
            { category: 'Wins', value: toString(wins) },
            { category: 'Losses', value: toString(losses) },
            { category: 'Titles', value: toString(titles) }
        ] AS stats
    `,
        formattedParams
    );

    const events = records.map((record) => record.toObject());

    return events[0].stats;
});
