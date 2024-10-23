import { Card, Col, Progress, Row } from "antd";
import { percentage } from "../../utils/utils";

export default function TotalStat({ p1, p2, stat }) {
  return (
    <Col span={7}>
      <Card
        type="inner"
        title={stat}
        className="border-zinc-500 my-3 text-center"
      >
        <Row className="items-center">
          <Col span={3} className="text-left pl-1">
            <div className="text-xl">{p1}</div>
            <div className="text-xl">{percentage(p1, p1 + p2).toFixed(0)}%</div>
          </Col>
          <Col span={18}>
            <Progress
              percent={percentage(p1, p1 + p2).toFixed(0)}
              showInfo={false}
              type="dashboard"
              strokeColor="#1e40af"
              trailColor="#047857"
            />
          </Col>
          <Col span={3} className="text-right pr-1">
            <div className="text-xl">{p2}</div>
            <div className="text-xl">{percentage(p2, p1 + p2).toFixed(0)}%</div>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}
