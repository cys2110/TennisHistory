import { Table } from "antd";
import { formatCurrency } from "../../utils/utils";

export default function PrizeMoney({ rounds, currency }) {
  const columns = [
    {
      title: "Round",
      dataIndex: "round",
      align: "center",
    },
    {
      title: "Prize Money",
      dataIndex: "pm",
      render: (pm) => `${formatCurrency(currency, pm)}`,
      align: "center",
    },
    {
      title: "Points",
      dataIndex: "points",
      align: "center",
    },
  ];

  return (
    <>
      <div id="awards" className="text-4xl">
        Awards
      </div>
      <Table
        columns={columns}
        dataSource={rounds}
        rowKey={(round) => round.round}
        pagination={false}
        className="my-10"
        size="middle"
      />
    </>
  );
}
