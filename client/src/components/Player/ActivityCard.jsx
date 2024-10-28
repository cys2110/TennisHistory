import { useParams } from "react-router";
import { Avatar, Card, Col, Image, Row } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { encodeName, formattedDates } from "../../utils/utils";
import { Link } from "react-router-dom";
import WinnerScore from "../Global/WinnerScore";

export default function ActivityCard({ event, year }) {
  const { pname, pid } = useParams();
  const { Meta } = Card;
  const eventDetails = event.scores[0].match.round.event;

  const currencies = {
    AUD: "A$",
    USD: "$",
    GBP: "£",
    EUR: "€",
  };

  const rounds = {
    "Round of 128": "R128",
    "Round of 64": "R64",
    "Round of 32": "R32",
    "Round of 16": "R16",
    Quarterfinals: "QF",
    Semifinals: "SF",
    Final: "F",
  };

  const title = (
    <div>
      <div>
        {eventDetails.sponsor_name && (
          <span>{eventDetails.sponsor_name} | </span>
        )}
        {eventDetails.tournament.name}
      </div>
      <div>
        {formattedDates(eventDetails.start_date, eventDetails.end_date)} |{" "}
        {eventDetails.venue.city}, {eventDetails.venue.country.name}
      </div>
    </div>
  );

  const extra = (
    <div>
      <div>{eventDetails.category}</div>
      <div>
        {eventDetails.surface.environment} {eventDetails.surface.surface}
      </div>
    </div>
  );

  const description = (
    <div className="flex">
      {event.seed && <div>Seed: {event.seed}</div>}
      {event.status && <div>Status: {event.status}</div>}
      <div>Points: {event.points}</div>
      <div>Rank: {event.rank}</div>
      <div>
        Prize Money: {currencies[eventDetails.currency]}
        {event.pm}
      </div>
    </div>
  );

  const entryInfo = (entry) => {
    if (entry.seed && entry.status) {
      return `(${entry.seed} ${entry.status})`;
    } else if (entry.seed) {
      return `(${entry.seed})`;
    } else if (entry.status) {
      return `(${entry.status})`;
    }
  };
  return (
    <Card title={title} extra={extra}>
      {event.scores.map((match) => {
        const player = match.match.p1?.player ? match.match.p2 : match.match.p1;
        const opponent = match.match.p1?.player
          ? match.match.p1
          : match.match.p2;
        return (
          <Row>
            <Col span={1}>{rounds[match.match.round.round]}</Col>
            <Col span={1}>
              {opponent.player && (
                <Image
                  alt={opponent.player?.player.country.name}
                  src={`/flags/${opponent.player?.player.country.id}.svg`}
                  className="rounded"
                />
              )}
            </Col>
            <Col span={2}>
              {match.match.incomplete !== "B" && (
                <Avatar
                  alt={opponent.player?.player?.full_name}
                  src={`https://www.atptour.com/-/media/alias/player-headshot/${opponent.player?.player?.id}`}
                  className="border-zinc-300 mx-2"
                />
              )}
            </Col>
            <Col span={10}>
              {match.match.incomplete === "B" ? (
                "BYE"
              ) : (
                <div>
                  <Link
                    className="hover-link"
                    to={`/players/${encodeName(
                      opponent.player?.player?.full_name
                    )}/${opponent.player?.player?.id}`}
                  >
                    {opponent.player?.player?.full_name}
                  </Link>{" "}
                  {(opponent.player.seed || opponent.player.status) && (
                    <small>{entryInfo(opponent.player)}</small>
                  )}
                </div>
              )}
            </Col>
            <Col span={1}>
              {match.match.incomplete !== "B" && opponent.player.rank}
            </Col>
            <Col span={1}>
              {match.match.winner.player.player.id === pid ? (
                <CheckCircleTwoTone twoToneColor="#52c41a" />
              ) : (
                <CloseCircleTwoTone twoToneColor="#b91c1c" />
              )}
            </Col>
            <Col span={5}>
              <Link
                className="hover-link"
                to={`/tournaments/${encodeName(eventDetails.tournament.name)}/${
                  eventDetails.tournament.id
                }/${year}/${eventDetails.id}/${match.match.match_no}`}
              >
                <WinnerScore winner={player} loser={opponent} />
              </Link>
            </Col>
            <Col span={3}>
              {opponent?.player && (
                <Link
                  className="hover-link"
                  to={`/h2h/${pname}/${pid}/${encodeName(
                    opponent.player.player.full_name
                  )}/${opponent?.player.player.id}`}
                >
                  H2H
                </Link>
              )}
            </Col>
          </Row>
        );
      })}
      <Meta description={description} />
    </Card>
  );
}
