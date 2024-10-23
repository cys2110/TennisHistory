import { Card, Row, Col, Image, Button } from "antd";
import { DateTime } from "luxon";
import { encodeName, formattedDates } from "../../utils/utils";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const { Meta } = Card;

  const eventPages = [
    <Button
      type="dashed"
      ghost={true}
      shape="round"
      size="small"
      disabled={DateTime.now() < DateTime.fromISO(event.start_date) && true}
      className="!w-2/3 custom-disabled !text-zinc-300 !border-zinc-300 hover:!text-zinc-400 hover:!border-zinc-400"
      href={`/tournaments/${encodeName(event.tournament.name)}/${
        event.tournament.id
      }/${event.year.id}/${event.id}`}
    >
      Details
    </Button>,
    <Button
      type="dashed"
      ghost={true}
      shape="round"
      size="small"
      disabled={DateTime.now() < DateTime.fromISO(event.start_date) && true}
      className="!w-2/3 custom-disabled !text-zinc-300 !border-zinc-300 hover:!text-zinc-400 hover:!border-zinc-400"
      href={`/tournaments/${encodeName(event.tournament.name)}/${
        event.tournament.id
      }/${event.year.id}/${event.id}/results`}
    >
      Results
    </Button>,
    <Button
      type="dashed"
      ghost={true}
      shape="round"
      size="small"
      disabled={DateTime.now() < DateTime.fromISO(event.start_date) && true}
      className="!w-2/3 custom-disabled !text-zinc-300 !border-zinc-300 hover:!text-zinc-400 hover:!border-zinc-400"
      href={`/tournaments/${encodeName(event.tournament.name)}/${
        event.tournament.id
      }/${event.year.id}/${event.id}/draw`}
    >
      Draw
    </Button>,
  ];

  if (event.venue && event.surface?.environment) {
    return (
      <Card
        cover={
          <img
            alt={event.venue.country.name}
            src={`./flags/${event.venue.country.id}.svg`}
            className="h-48 object-cover opacity-75 -z-10"
          />
        }
        actions={eventPages}
        className="h-full flex flex-col justify-between"
      >
        <Row>
          <Col span={19}>
            <Meta
              title={
                <Link
                  to={`/tournaments/${event.tournament.name}/${event.tournament.id}`}
                  className="hover-link"
                >
                  {event.tournament.name}
                </Link>
              }
              description={event.sponsor_name ?? ""}
            />
            <div className="mt-3 flex flex-col justify-center">
              <div>
                {event.venue.city}, {event.venue.country.name}
              </div>
              <div>{formattedDates(event.start_date, event.end_date)}</div>
              <div>
                {event.surface.environment} {event.surface.surface}
                {event.surface.hard_type ? (
                  <span> ({event.surface.hard_type})</span>
                ) : null}
              </div>
            </div>
          </Col>
          <Col span={5} className="self-center">
            <Image
              alt={event.category}
              src={`/category/${event.category}.svg`}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
