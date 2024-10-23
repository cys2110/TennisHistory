import { Avatar, Card, Col, Image, Row, Tag } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { encodeName, formatDate, formatTime } from "../../utils/utils";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import PlayerItem from "../Global/PlayerItem";
import ScoreItem from "../Global/ScoreItem";

export default function ResultCard({ match }) {
  const { tname, tid, year, eid } = useParams();

  const title = (
    <div>
      {match.date ? <div>{formatDate(match.date)}</div> : null}
      {match.court && <div>{match.court}</div>}
    </div>
  );

  const extra = (
    <div>
      {match.duration_mins ? (
        <div className="text-right">{formatTime(match.duration_mins)}</div>
      ) : null}
      {match.umpire && <div className="text-right">{match.umpire.id}</div>}
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

  const actions = [
    !match.incomplete && (
      <Tag className="mx-auto bg-transparent border-zinc-300">
        <Link
          to={`/tournaments/${tname}/${tid}/${year}/${eid}/${match.match_no}`}
          className="!text-zinc-300"
        >
          Stats
        </Link>
      </Tag>
    ),
    match.incomplete !== "B" && (
      <Tag className="mx-auto bg-transparent border-zinc-300">
        <Link
          to={`/h2h/${encodeName(match.winner.player.player.full_name)}/${
            match.winner.player.player.id
          }/${encodeName(match.loser.player.player.full_name)}/${
            match.loser.player.player.id
          }`}
          className="!text-zinc-300"
        >
          H2H
        </Link>
      </Tag>
    ),
  ];

  return (
    <>
      <Card
        title={title}
        extra={extra}
        actions={actions}
        className="h-full flex flex-col justify-between p-1"
      >
        <Row className="mb-2">
          <Col span={19}>
            <Row className="items-center">
              <PlayerItem
                player={match.winner.player.player}
                entry={entryInfo(match.winner.player)}
              />
            </Row>
          </Col>
          <Col span={2}>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          </Col>
          <Col className="flex" span={3}>
            <ScoreItem score={match.winner} />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col span={19}>
            <Row className="items-center">
              {match.loser ? (
                <PlayerItem
                  player={match.loser.player.player}
                  entry={entryInfo(match.loser.player)}
                />
              ) : (
                <>
                  <Col span={6} />
                  <Col span={18}>BYE</Col>
                </>
              )}
            </Row>
          </Col>
          <Col span={2}>
            {match.loser?.incomplete && (
              <Tag color="#f5222d">{match.loser.incomplete}</Tag>
            )}
          </Col>
          <Col className="flex" span={3}>
            {match.loser && <ScoreItem score={match.loser} />}
          </Col>
        </Row>
      </Card>
    </>
  );
}
