import { Helmet } from "react-helmet-async";
import { Outlet, useMatch, useParams } from "react-router";
import { Col, Image, Row } from "antd";
import { unencodeName } from "../../utils/utils";
import { useQuery } from "@apollo/client";
import { GET_PLAYER } from "../../services/PlayerService";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import PlayerBreadcrumbs from "./PlayerBreadcrumbs";
import PlayerDetails from "./PlayerDetails";

export default function Player() {
  const { pname, pid } = useParams();
  const parentPage = useMatch("/players/:pname/:pid");
  let player;

  const { loading, error, data } = useQuery(GET_PLAYER, {
    variables: { id: pid },
  });
  if (data) player = data.players[0];
  if (error) console.error(error);

  return (
    <>
      <PlayerBreadcrumbs pname={pname} pid={pid} />
      {parentPage && (
        <>
          <Helmet>
            <title>{unencodeName(pname)} | TennisHistory</title>
          </Helmet>
          <Title title="Player Overview" />
          {data && (
            <>
              <Row>
                <Col span={4}>
                  <Image
                    alt={player.full_name}
                    src={
                      player.gladiator
                        ? `https://www.atptour.com/-/media/alias/player-gladiator-headshot/${player.id}`
                        : `https://www.atptour.com/-/media/alias/player-headshot/${player.id}`
                    }
                    preview={false}
                  />
                </Col>
                <Col span={20}>
                  <PlayerDetails player={player} />
                </Col>
              </Row>
            </>
          )}
          {!data && <Loading loading={loading} none="No data available" />}
        </>
      )}
      <Outlet />
    </>
  );
}
