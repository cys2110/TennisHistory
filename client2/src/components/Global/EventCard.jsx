import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { Card, Row, Col, Image, Button, Tooltip } from "antd";
import { encodeName, formattedDates } from "../../utils/utils";
import { SURFACES } from "../../utils/variables";

export default function EventCard({ event }) {
  const { Meta } = Card;

  const eventPages = [
    { name: "Details", slug: "" },
    { name: "Results", slug: "results" },
    { name: "Draw", slug: "draw" },
  ];

  const eventButton = (page) => {
    const isDisabled = DateTime.now() < DateTime.fromISO(event.start_date);

    const button = (
      <Button
        type="dashed"
        ghost={true}
        shape="round"
        size="small"
        block={true}
        disabled={isDisabled}
        className="!w-11/12 custom-disabled !text-zinc-300 !border-zinc-300 hover:!text-zinc-400 hover:!border-zinc-400"
        key={page.name}
        href={`/tournaments/${encodeName(event.tournament.name)}/${
          event.tournament.id
        }/${event.year.id}/${event.id}/${page.slug}`}
      >
        {page.name}
      </Button>
    );

    return isDisabled ? (
      <Tooltip title="Event has not started yet">{button}</Tooltip>
    ) : (
      button
    );
  };

  const eventButtons = eventPages.map((page) => {
    return eventButton(page);
  });

  return (
    <Card
      cover={
        <img
          alt={event.venue?.country.name || event.category}
          src={
            event.venue
              ? `./flags/${event.venue.country.id}.svg`
              : `./category/${event.category}.svg`
          }
          className="h-48 object-cover opacity-75 -z-10"
        />
      }
      actions={eventButtons}
      className="h-full flex flex-col justify-between"
    >
      <Row>
        <Col span={24}>
          <Meta
            title={
              <Link
                to={`/tournaments/${event.tournament.name}/${event.tournament.id}`}
                className="hover-link text-wrap"
              >
                {event.tournament.name}
              </Link>
            }
            description={event.sponsor_name ?? ""}
          />
        </Col>
        <Col span={19}>
          <div className="mt-3 flex flex-col justify-center">
            {event.venue && (
              <div>
                {event.venue.city}, {event.venue.country.name}
              </div>
            )}
            <div>{formattedDates(event.start_date, event.end_date)}</div>
            {event.surface && <div>{SURFACES[event.surface.id]}</div>}
          </div>
        </Col>
        <Col span={5} className="self-center">
          {event.category && (
            <Image
              alt={event.category}
              src={`/category/${event.category}.svg`}
            />
          )}
        </Col>
      </Row>
    </Card>
  );
}
