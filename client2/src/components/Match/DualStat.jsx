import { Card, Col, Progress, Row } from "antd";
import { percentage } from "../../utils/utils";

export default function DualStat({ p1, p1Total, p2, p2Total, stat }) {
  return (
    <>
      <Col span={7}>
        <Card
          type="inner"
          title={stat}
          className="border-zinc-500 my-3 text-center"
        >
          <Row className="items-center justify-evenly">
            <Col span={10}>
              <Progress
                percent={percentage(p1, p1Total).toFixed(0)}
                type="circle"
                format={(percent) => `${p1}/${p1Total} (${percent}%)`}
                strokeColor="#1e40af"
              />
            </Col>
            <Col span={10}>
              <Progress
                percent={percentage(p2, p2Total).toFixed(0)}
                type="circle"
                format={(percent) => `${p2}/${p2Total} (${percent}%)`}
                strokeColor="#047857"
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
}
