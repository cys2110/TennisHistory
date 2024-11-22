import { Card, Row } from "antd";
import ComparisonChart from "./ComparisonChart";

export default function ReturnStats({
  p1Ret1Win,
  p1Ret1,
  p2Ret1Win,
  p2Ret1,
  p1Ret2Win,
  p1Ret2,
  p2Ret2Win,
  p2Ret2,
  p1BpsConverted,
  p1BpOpps,
  p2BpsConverted,
  p2BpOpps,
}) {
  const comparisonData = [
    {
      name: "1st Serve Return Points Won",
      p1Value: p1Ret1Win,
      p1Max: p1Ret1,
      p2Value: p2Ret1Win,
      p2Max: p2Ret1,
    },
    {
      name: "2nd Serve Return Points Won",
      p1Value: p1Ret2Win,
      p1Max: p1Ret2,
      p2Value: p2Ret2Win,
      p2Max: p2Ret2,
    },
    {
      name: "Break Points Converted",
      p1Value: p1BpsConverted,
      p1Max: p1BpOpps,
      p2Value: p2BpsConverted,
      p2Max: p2BpOpps,
    },
  ];
  return (
    <Card
      id="return-stats"
      title="RETURN STATS"
      className="my-10"
      bordered={false}
    >
      <Row>
        {comparisonData.map((stat) => {
          return <ComparisonChart key={stat.name} stat={stat} />;
        })}
      </Row>
    </Card>
  );
}
