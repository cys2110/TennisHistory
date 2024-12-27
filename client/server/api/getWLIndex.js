export default defineEventHandler(async (query) => {
  const { pid } = getQuery(query);

  const { records } = await useDriver().executeQuery(
    `
        MATCH (p:Player {id: $id})-[:ENTERED]-(g1:Entry)-[:SCORED]-(f:Score)-[:SCORED]-(m:Match)-[:SCORED]-(f2:Score)-[:SCORED]-(g2:Entry)-[:ENTERED]-(p2:Player)
        MATCH (m)-[:PLAYED]-(r:Round)-[:ROUND_OF]-(e:Event)-[:ON_SURFACE]-(s:Surface)
        RETURN [
        {category: 'Match Record', stat: 'Overall', wins: sum(CASE WHEN f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Match Record', stat: 'Grand Slams', wins: sum(CASE WHEN e.category = 'Grand Slam' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN e.category = 'Grand Slam' AND f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN e.category = 'Grand Slam' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Match Record', stat: 'ATP Masters 1000', wins: sum(CASE WHEN e.category = 'ATP Masters 1000' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN e.category = 'ATP Masters 1000' AND f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN e.category = 'ATP Masters 1000' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Pressure Points', stat: 'Tie Breaks', wins: sum(CASE WHEN (f.s1 = 7 AND f2.s1 = 6) OR (f.s2 = 7 AND f2.s2 = 6) OR (f.s3 = 7 AND f2.s3 = 6) OR (f.s4 = 7 AND f2.s4 = 6) OR (f.s5 = 7 AND f2.s5 = 6) THEN 1 ELSE 0 END), losses: sum(CASE WHEN (f.s1 = 6 AND f2.s1 = 7) OR (f.s2 = 6 AND f2.s2 = 7) OR (f.s3 = 6 AND f2.s3 = 7) OR (f.s4 = 6 AND f2.s4 = 7) OR (f.s5 = 6 AND f2.s5 = 7) THEN 1 ELSE 0 END)},
        {category: 'Pressure Points', stat: 'Versus Top 10', wins: sum(CASE WHEN g2.rank < 11 AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN g2.rank < 11 AND f:Loser THEN 1 ELSE 0 END)},
        {category: 'Pressure Points', stat: 'Finals', wins: sum(CASE WHEN r.round = 'Final' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN r.round = 'Final' AND f:Loser THEN 1 ELSE 0 END)},
        {category: 'Pressure Points', stat: 'Deciding Set', wins: sum(CASE WHEN ((m:Best3 AND f.s3 IS NOT NULL) OR (m:Best5 AND f.s5 IS NOT NULL)) AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN ((m:Best3 AND f.s3 IS NOT NULL) OR (m:Best5 AND f.s5 IS NOT NULL)) AND f:Loser THEN 1 ELSE 0 END)},
        {category: 'Pressure Points', stat: '5th Set Record', wins: sum(CASE WHEN f.s5 IS NOT NULL AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN f.s5 IS NOT NULL AND f:Loser THEN 1 ELSE 0 END)},
        {category: 'Environment', stat: 'Clay', wins: sum(CASE WHEN s.surface = 'Clay' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN s.surface = 'Clay' AND f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN s.surface = 'Clay' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Environment', stat: 'Grass', wins: sum(CASE WHEN s.surface = 'Grass' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN s.surface = 'Grass' AND f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN s.surface = 'Grass' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Environment', stat: 'Hard', wins: sum(CASE WHEN s.surface = 'Hard' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN s.surface = 'Hard' AND f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN s.surface = 'Hard' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Environment', stat: 'Carpet', wins: sum(CASE WHEN s.surface = 'Carpet' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN s.surface = 'Carpet' AND f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN s.surface = 'Carpet' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Environment', stat: 'Indoor', wins: sum(CASE WHEN s.environment = 'Indoor' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN s.environment = 'Indoor' AND f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN s.environment = 'Indoor' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Environment', stat: 'Outdoor', wins: sum(CASE WHEN s.environment = 'Outdoor' AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN s.environment = 'Outdoor' AND f:Loser THEN 1 ELSE 0 END), titles: sum(CASE WHEN s.environment = 'Outdoor' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END)},
        {category: 'Other', stat: 'After Winning 1st Set', wins: sum(CASE WHEN f.s1 > f2.s1 AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN f.s1 < f2.s1 AND f:Loser THEN 1 ELSE 0 END)},
        {category: 'Other', stat: 'After Losing 1st Set', wins: sum(CASE WHEN f.s1 < f2.s1 AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN f.s1 > f2.s1 AND f:Loser THEN 1 ELSE 0 END)},
        {category: 'Other', stat: 'Vs. Right-Handers', wins: sum(CASE WHEN p2.rh = true AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN p2.rh = true AND f:Loser THEN 1 ELSE 0 END)},
        {category: 'Other', stat: 'Vs. Left-Handers', wins: sum(CASE WHEN p2.rh = false AND f:Winner THEN 1 ELSE 0 END), losses: sum(CASE WHEN p2.rh = false AND f:Loser THEN 1 ELSE 0 END)}] as index
        `,
    { id: pid }
  );

  const player = records.map((record) => record.toObject());

  return player[0].index;
});
