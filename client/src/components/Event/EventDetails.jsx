import { Card, Col, Descriptions, Row, Statistic } from "antd";
import { formattedDates } from "../../utils/utils";

export default function EventDetails({ event }) {
  const currencies = {
    AUD: "A$",
    USD: "$",
    GBP: "£",
    EUR: "€",
  };

  return (
    <>
      <Row justify="space-evenly">
        <Col span={6}>
          <Card>
            <Statistic
              title="Prize Money"
              value={event.pm}
              prefix={currencies[event.currency]}
              className="text-center"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Financial Commitment"
              value={event.tfc}
              prefix={currencies[event.currency]}
              className="text-center"
            />
          </Card>
        </Col>
      </Row>
      <Descriptions
        colon={false}
        className="my-10"
        bordered
        layout="vertical"
        size="middle"
      >
        {event.sponsor_name && (
          <Descriptions.Item label="Sponsor name">
            <div>{event.sponsor_name}</div>
          </Descriptions.Item>
        )}
        {event.category && (
          <Descriptions.Item label="Category">
            {event.category}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Dates">
          {formattedDates(event.start_date, event.end_date)}
        </Descriptions.Item>
        <Descriptions.Item label="Surface">
          {event.surface.environment} {event.surface.surface}
          {event.surface.hard_type && <span> ({event.surface.hard_type})</span>}
        </Descriptions.Item>
        <Descriptions.Item label="Venue">
          <div className="flex flex-col justify-center">
            <div>{event.venue.name || "—"}</div>
            <div>
              {event.venue.city}, {event.venue.country.name}
            </div>
          </div>
        </Descriptions.Item>
        <Descriptions.Item
          label={event.supervisors.length === 1 ? "Supervisor" : "Supervisors"}
        >
          {event.supervisors.length > 0 ? (
            event.supervisors.map((supervisor) => (
              <div key={supervisor.id}>{supervisor.id}</div>
            ))
          ) : (
            <div>—</div>
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
