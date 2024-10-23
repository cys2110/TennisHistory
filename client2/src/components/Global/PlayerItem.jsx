import { Avatar, Col, Image } from "antd";
import { Link } from "react-router-dom";
import { encodeName } from "../../utils/utils";

export default function PlayerItem({ player, entry }) {
  return (
    <>
      <Col span={2}>
        <Image
          alt={player.country.name}
          src={`/flags/${player.country.id}.svg`}
          className="rounded"
        />
      </Col>
      <Col span={3}>
        <Avatar
          alt={player.full_name}
          src={`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`}
          className="border-zinc-300 mx-2"
        />
      </Col>
      <Col span={18} className="ml-2 px-2 text-left">
        <Link
          className="hover-link"
          to={`/players/${encodeName(player.full_name)}/${player.id}`}
        >
          {player.full_name}
        </Link>
        {entry && <small> {entry}</small>}
      </Col>
    </>
  );
}
