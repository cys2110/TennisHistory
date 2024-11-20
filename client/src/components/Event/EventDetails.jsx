import { Card, Col, Descriptions, Row, Statistic } from "antd";
import { formattedDates } from "../../utils/utils";
import { CURRENCIES, SURFACES } from "../../utils/variables";

export default function EventDetails({ event }) {
  const statistics = [
    { title: "Prize Money", value: event.pm || "—" },
    { title: "Total Financial Commitment", value: event.tfc || "—" },
  ];

  const details = [
    { label: "Sponsor name", text: event.sponsor_name ?? "—" },
    { label: "Category", text: event.category ?? "—" },
    { label: "Dates", text: formattedDates(event.start_date, event.end_date) },
    {
      label: "Surface",
      text: SURFACES[event.surface.id] ?? "—",
    },
    {
      label: "Venue",
      text: event.venue ? (
        <div className="flex flex-col justify-center">
          <div>{event.venue.name || "—"}</div>
          <div>
            {event.venue.city}, {event.venue.country.name}
          </div>
        </div>
      ) : (
        "—"
      ),
    },
    {
      label: event.supervisors.length === 1 ? "Supervisor" : "Supervisors",
      text:
        event.supervisors.length > 0
          ? event.supervisors.map((supervisor) => (
              <div key={supervisor.id}>{supervisor.id}</div>
            ))
          : "—",
    },
  ];

  return (
    <>
      <Row justify="space-evenly">
        {statistics.map((stat) => {
          return (
            <Col span={6} key={stat.title}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={CURRENCIES[event.currency] || ""}
                  className="text-center"
                />
              </Card>
            </Col>
          );
        })}
      </Row>
      <Descriptions
        colon={false}
        className="my-10"
        bordered
        layout="vertical"
        size="middle"
      >
        {details.map((detail) => {
          return (
            <Descriptions.Item key={detail.label} label={detail.label}>
              {detail.text}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </>
  );
}
