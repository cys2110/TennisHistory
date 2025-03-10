import { SurfaceEnum } from "~/utils/enums";

export default defineEventHandler(async (event) => {
	const { surfaces, years, id } = getQuery<{ surfaces: SurfaceEnum | SurfaceEnum[]; years: string | string[]; id: string }>(event);

	const formattedParams = {
		id,
		surfaces: Array.isArray(surfaces) ? surfaces : [surfaces],
		years: Array.isArray(years) ? years.map((year) => parseInt(year)) : years ? [parseInt(years)] : []
	};

	const { records } = await useDriver().executeQuery(
		`/* cypher */
      MATCH (p:Player {id: $id})-[:ENTERED]->(:Entry)-[:SCORED]->(s:Score)-[:SCORED]->(:Match)-[:PLAYED]->(:Round)-[:ROUND_OF]->(e:Event)-[:IN_YEAR]->(y:Year)
      WHERE y.id IN $years
      MATCH (e)-[:ON_SURFACE]-(z:Surface) WHERE z.surface IN $surfaces
      RETURN [
        {category: 'Aces', value: toString(sum(s.aces)), suffix: false},
        {category: 'Double faults', value: toString(sum(s.dfs)), suffix: false},
        {category: '1st serve', value: toString(round((sum(s.serve1) / (toFloat(sum(s.serve1)) + toFloat(sum(s.serve2)))) * 100, 0))},
        {category: '1st serve points won', value: toString(round((sum(s.serve1_w) / toFloat(sum(s.serve1))) * 100, 0))},
        {category: '2nd serve points won', value: toString(round((sum(s.serve2_w) / toFloat(sum(s.serve2))) * 100, 0))},
        {category: 'Break points won', value: toString(round((sum(s.bps_saved) / toFloat(sum(s.bps_faced))) * 100, 0))},
        {category: 'Service points won', value: toString(round((sum(s.serve1_w) + sum(s.serve2_w)) / (toFloat(sum(s.serve1)) + toFloat(sum(s.serve2))) * 100, 0))},
        {category: '1st serve return points won', value: toString(round((sum(s.ret1_w) / toFloat(sum(s.ret1))) * 100, 0))},
        {category: '2nd serve return points won', value: toString(round((sum(s.ret2_w) / toFloat(sum(s.ret2))) * 100, 0))},
        {category: 'Break points converted', value: toString(round((sum(s.bps_converted) / toFloat(sum(s.bp_opps))) * 100, 0))},
        {category: 'Return points won', value: toString(round((sum(s.ret1_w) + sum(s.ret2_w)) / (toFloat(sum(s.ret1)) + toFloat(sum(s.ret2))) * 100, 0))},
        {category: 'Total points won', value: toString(round((sum(s.serve1_w) + sum(s.serve2_w) + sum(s.ret1_w) + sum(s.ret2_w)) / (toFloat(sum(s.serve1)) + toFloat(sum(s.serve2)) + toFloat(sum(s.ret1)) + toFloat(sum(s.ret2))) * 100, 0))}
      ] as stats
    `, formattedParams
	);

	const stats = records.map((record) => record.toObject());

	return stats[0].stats;
});
