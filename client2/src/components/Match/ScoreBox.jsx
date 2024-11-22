import { Card, Col, Row, Tag } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import ScoreItem from "../Global/ScoreItem";

export default function ScoreBox({ p1, p2, winner }) {
  const set = Array.from({ length: 5 }, (_, i) => i);
  const entryInfo = (entry) => {
    if (entry.seed && entry.status) {
      return `(${entry.seed} ${entry.status})`;
    } else if (entry.seed) {
      return `(${entry.seed})`;
    } else if (entry.status) {
      return `(${entry.status})`;
    }
  };
  return (
    <Card>
      <Row className="mb-2">
        <Col className="flex items-center" span={15}>
          {p1.player.player.full_name}
        </Col>
        <Col span={2}>
          <small>{entryInfo(p1.player)}</small>
        </Col>
        <Col span={2} className="flex items-center">
          {p1.player.player.id === winner ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : p1.incomplete ? (
            <Tag color="#f5222d">{p1.incomplete}</Tag>
          ) : null}
        </Col>
        <Col span={5} className="flex justify-end">
          <ScoreItem score={p1} />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col className="flex items-center" span={15}>
          {p2.player.player.full_name}
        </Col>
        <Col span={2}>
          <small>{entryInfo(p2.player)}</small>
        </Col>
        <Col span={2} className="flex items-center">
          {p2.player.player.id === winner ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : p2.incomplete ? (
            <Tag color="#f5222d">{p2.incomplete}</Tag>
          ) : null}
        </Col>
        <Col span={5} className="flex justify-end">
          <ScoreItem score={p2} />
        </Col>
      </Row>
    </Card>
  );
}
