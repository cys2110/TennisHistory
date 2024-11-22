import { Card, Row } from "antd";
import ComparisonChart from "./ComparisonChart";
import NestedChart from "./NestedChart";

export default function ServiceStats({
  p1Aces,
  p2Aces,
  p1Dfs,
  p2Dfs,
  p1Serve1,
  p2Serve1,
  p1Serve2,
  p2Serve2,
  p1Serve1Win,
  p2Serve1Win,
  p1Serve2Win,
  p2Serve2Win,
  p1BpsSaved,
  p1BpsFaced,
  p2BpsSaved,
  p2BpsFaced,
}) {
  const comparisonData = [
    {
      name: "First Serve",
      p1Max: p1Serve1 + p1Serve2,
      p1Value: p1Serve1,
      p2Max: p2Serve1 + p2Serve2,
      p2Value: p2Serve1,
    },
    {
      name: "1st Serve Points Won",
      p1Value: p1Serve1Win,
      p1Max: p1Serve1,
      p2Value: p2Serve1Win,
      p2Max: p2Serve1,
    },
    {
      name: "2nd Serve Points Won",
      p1Value: p1Serve2Win,
      p1Max: p1Serve2,
      p2Value: p2Serve2Win,
      p2Max: p2Serve2,
    },
    {
      name: "Break Points Saved",
      p1Value: p1BpsSaved,
      p1Max: p1BpsFaced,
      p2Value: p2BpsSaved,
      p2Max: p2BpsFaced,
    },
  ];

  return (
    <Card
      id="service-stats"
      title="SERVICE STATS"
      className="my-10"
      bordered={false}
    >
      <Row>
        <NestedChart
          p1Nested={p1Dfs}
          p1Outer={p1Aces}
          p2Nested={p2Dfs}
          p2Outer={p2Aces}
          nestedName="Double Faults"
          outerName="Aces"
        />
        {comparisonData.map((stat) => {
          return <ComparisonChart key={stat.name} stat={stat} />;
        })}
      </Row>
    </Card>
  );
}
