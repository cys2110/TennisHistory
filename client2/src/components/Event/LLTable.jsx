import { Row, Table } from "antd";
import PlayerItem from "../Global/PlayerItem";

export default function LLTable({ players, title, short }) {
  const columns = [
    {
      title: title,
      dataIndex: "player",
      render: (player) => (
        <Row className="items-center">
          <PlayerItem player={player} />
        </Row>
      ),
      className: "!px-5",
    },
  ];

  return (
    <Table
      id={short}
      columns={columns}
      dataSource={players}
      rowKey={(player) => player.player.id}
      pagination={false}
      size="small"
      className="my-5 ml-2"
    />
  );
}
