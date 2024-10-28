import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import PlayerItem from "../Global/PlayerItem";
import WinnerScore from "../Global/WinnerScore";

export default function TournamentCard({ event }) {
  const { Meta } = Card;

  if (event.rounds.length > 0) {
    const final = event.rounds[0]?.matches[0];

    const players = (
      <div>
        <Row className="items-center mb-2">
          <PlayerItem player={final.winner.player.player} />
        </Row>
        <Row className="justify-center">
          <Col>d.</Col>
        </Row>
        <Row className="mt-2 items-center">
          <PlayerItem player={final.loser.player.player} />
        </Row>
      </div>
    );

    return (
      <>
        <Card
          title={
            <Link className="hover-link" to={`${event.year.id}/${event.id}`}>
              {event.year.id}
            </Link>
          }
        >
          <Meta
            title={players}
            description={
              <WinnerScore winner={final.winner} loser={final.loser} />
            }
            className="text-center"
          />
        </Card>
      </>
    );
  }
}
