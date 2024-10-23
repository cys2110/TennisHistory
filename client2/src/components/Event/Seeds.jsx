import { Row, Table } from "antd";
import PlayerItem from "../Global/PlayerItem";

export default function Seeds({ seeds }) {
  const columns = [
    {
      title: "Seed",
      dataIndex: "seed",
      align: "center",
      className: "!px-5",
    },
    {
      title: "Player",
      dataIndex: "player",
      render: (player) => (
        <Row className="items-center">
          <PlayerItem player={player} />
        </Row>
      ),
      className: "!px-5",
    },
    {
      title: "Rank",
      dataIndex: "rank",
      align: "center",
      className: "!px-5",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={seeds}
      rowKey={(seed) => seed.seed}
      pagination={false}
      className="my-10 mr-2"
      size="middle"
    />
  );
}
