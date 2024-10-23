import { Row, Table } from "antd";
import PlayerItem from "../Global/PlayerItem";

export default function LdaTable({ players }) {
  const columns = [
    {
      title: "Last Direct Acceptance",
      dataIndex: "node",
      render: (node) => (
        <Row className="items-center">
          <PlayerItem player={node.player} />
        </Row>
      ),
      className: "!px-5",
    },
    {
      title: "Rank",
      dataIndex: "properties",
      render: (properties) => properties.rank,
      align: "center",
      className: "!px-5",
    },
  ];

  return (
    <Table
      id="lda"
      columns={columns}
      dataSource={players}
      rowKey={(player) => player.node.player.id}
      pagination={false}
      size="small"
      className="mt-10 mb-5 ml-2"
    />
  );
}
