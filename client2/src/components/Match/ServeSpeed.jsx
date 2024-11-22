import { Card, Row } from "antd";
import SpeedGauge from "./SpeedGauge";

export default function ServeSpeed({
  p1Max,
  p1Avg1,
  p1Avg2,
  p2Max,
  p2Avg1,
  p2Avg2,
}) {
  const data = [
    {
      name: "Max Speed",
      p1: p1Max,
      p2: p2Max,
    },
    {
      name: "1st Serve Average Speed",
      p1: p1Avg1,
      p2: p2Avg1,
    },
    {
      name: "2nd Serve Average Speed",
      p1: p1Avg2,
      p2: p2Avg2,
    },
  ];

  return (
    <Card
      id="service-speed"
      title="SERVICE SPEED"
      className="my-10"
      bordered={false}
    >
      <Row>
        {data.map((stat) => {
          return <SpeedGauge key={stat.name} stat={stat} />;
        })}
      </Row>
    </Card>
  );
}
