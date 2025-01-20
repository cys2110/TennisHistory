export default defineEventHandler(async (query) => {
    const { id } = getQuery(query);

    const { records } = await useDriver().executeQuery(
        `/* cypher */
        MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(:Event)-[:TOOK_PLACE_IN]->(y:Year)
        WITH p.first_name || ' ' || p.last_name AS name, min(y.id) AS start, max(y.id) AS end
        RETURN {start: start, end: end, name: name} AS years
    `,
        { id }
    );

    const player = records.map((record) => record.toObject());

    return player[0].years;
});
