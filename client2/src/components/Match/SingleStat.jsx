import { Card, Col, Progress, Row } from "antd";
import { percentage } from "../../utils/utils";

export default function SingleStat({ p1, p2, stat }) {
  return (
    <Col span={7}>
      <Card
        type="inner"
        title={stat}
        className="border-zinc-500 my-3 text-center"
      >
        <Row className="items-center">
          <Col span={2}>
            <div className="text-2xl">{p1}</div>
          </Col>
          <Col span={20}>
            <Progress
              percent={percentage(p1, p1 + p2).toFixed(0)}
              showInfo={false}
              type="dashboard"
              strokeColor="#1e40af"
              trailColor="#047857"
            />
          </Col>
          <Col span={2}>
            <div className="text-2xl">{p2}</div>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}
