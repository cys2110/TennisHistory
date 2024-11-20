import { Link } from "react-router-dom";
import { Avatar, Image, Table } from "antd";
import { encodeName } from "../../utils/utils";

export default function Entries({ entries }) {
  const columns = [
    {
      width: "10%",
      dataIndex: "player",
      align: "center",
      render: (entry) => (
        <Image
          alt={entry.country.name}
          src={`/flags/${entry.country.id}.svg`}
          className="rounded !w-1/2"
          preview={false}
        />
      ),
    },
    {
      dataIndex: "player",
      render: (entry) => (
        <Avatar
          alt={entry.full_name}
          src={`https://www.atptour.com/-/media/alias/player-headshot/${entry.id}`}
          className="border-zinc-300"
        />
      ),
    },
    {
      dataIndex: "player",
      render: (entry) => (
        <Link
          className="hover-link"
          to={`/players/${encodeName(entry.full_name)}/${entry.id}`}
        >
          {entry.full_name}
        </Link>
      ),
    },
  ];

  return (
    <Table
      id="entries"
      columns={columns}
      dataSource={entries}
      rowKey={(entry) => entry.player.id}
      pagination={false}
      size="small"
      className="mt-10 mb-5 ml-2"
      showHeader={false}
    />
  );
}
