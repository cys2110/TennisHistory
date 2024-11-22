import { Table } from "antd";
import { Link } from "react-router-dom";
import { encodeName } from "../../utils/utils";

export default function FinalsTable({ events }) {
  const flattenedEvents = events.reduce((acc, event) => {
    const { year, count, events: eventList } = event;
    const rows = eventList.map((e, index) => ({
      year: index === 0 ? year : "",
      count: index === 0 ? count : "",
      event: e,
      rowSpan: index === 0 ? count : 0,
    }));
    return acc.concat(rows);
  }, []);

  const columns = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      onCell: (record) => ({
        rowSpan: record.rowSpan,
      }),
    },
    {
      title: "Total",
      dataIndex: "count",
      key: "count",
      onCell: (record) => ({
        rowSpan: record.rowSpan,
      }),
    },
    {
      title: "Event Name",
      dataIndex: "event",
      key: "eventName",
      render: (event) => (
        <Link
          className="hover-link"
          to={`/tournaments/${encodeName(event.tournament_name)}/${
            event.tournament_id
          }`}
        >
          {event.tournament_name}
        </Link>
      ),
    },
    {
      title: "Surface",
      dataIndex: ["event", "surface"],
      key: "surface",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={flattenedEvents}
      rowKey={(event) => event.event.id}
      pagination={false}
    />
  );
}
