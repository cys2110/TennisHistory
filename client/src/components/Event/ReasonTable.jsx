import { Row, Table } from "antd";
import PlayerItem from "../Global/PlayerItem";

export default function Reason({ players, title, short }) {
  const columns = [
    {
      title: title,
      dataIndex: "node",
      render: (node) => (
        <Row className="items-center">
          <PlayerItem player={node.player} />
        </Row>
      ),
      className: "!px-5",
    },
    {
      title: "Reason",
      dataIndex: "properties",
      render: (properties) => properties.reason,
      align: "center",
      className: "!px-5",
    },
  ];

  return (
    <Table
      id={short}
      columns={columns}
      dataSource={players}
      rowKey={(player) => player.node.player.id}
      pagination={false}
      size="small"
      className="my-5 ml-2"
    />
  );
}
