import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Anchor, Avatar, Col, ConfigProvider, Image, Row } from "antd";
import { GET_MATCH_STATS } from "../../services/MatchStatService";
import { unencodeName } from "../../utils/utils";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import MatchDetails from "./MatchDetails";
import ScoreBox from "./ScoreBox";
import ServiceStats from "./ServiceStats";
import ReturnStats from "./ReturnStats";
import PointStats from "./PointStats";
import ServeSpeed from "./ServeSpeed";

export default function MatchStats() {
  const { tname, tid, year, eid, mid } = useParams();
  const { loading, error, data } = useQuery(GET_MATCH_STATS, {
    variables: { matchNo: parseInt(mid), eventId: parseInt(eid) },
  });
  if (error) console.error(error);
  if (data) {
    const match = data.matches[0];
    const title = match.round.event.sponsor_name ?? unencodeName(tname);

    return (
      <>
        <Helmet>
          <title>
            {`${match.p1.player.player.full_name} v. ${match.p2.player.player.full_name}`}{" "}
            | TennisHistory
          </title>
        </Helmet>
        <Title title={title} />
        <Row>
          <Col span={4}>
            <Anchor
              offsetTop={75}
              items={[
                {
                  key: "1",
                  href: "#service-stats",
                  title: "Service Stats",
                },
                {
                  key: "2",
                  href: "#return-stats",
                  title: "Return Stats",
                },
                {
                  key: "3",
                  href: "#points-stats",
                  title: "Points Stats",
                },
              ]}
            />
          </Col>
          <Col span={20}>
            <MatchDetails match={match} />
            <ConfigProvider
              theme={{
                components: {
                  Card: {
                    colorBgContainer: "transparent",
                    headerBg: "#5b21b6",
                  },
                },
              }}
            >
              <Row align="middle">
                <Col
                  span={6}
                  className="text-center bg-violet-700 rounded-xl p-5"
                >
                  <Avatar
                    alt={match.p1.player.player.full_name}
                    src={`https://www.atptour.com/-/media/alias/player-headshot/${match.p1.player.player.id}`}
                    size={100}
                    className="border-zinc-300"
                  />
                  <Row className="my-5">
                    <Col span={4}>
                      <Image
                        alt={match.p1.player.player.country.name}
                        src={`/flags/${match.p1.player.player.country.id}.svg`}
                        className="rounded border-zinc-300 border-2"
                      />
                    </Col>
                    <Col span={19} className="text-xl pl-5">
                      {match.p1.player.player.full_name}
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="px-16">
                  <ScoreBox
                    p1={match.p1}
                    p2={match.p2}
                    winner={match.winner.player.player.id}
                  />
                </Col>
                <Col
                  span={6}
                  className="text-center bg-emerald-800 rounded-xl p-5"
                >
                  <Avatar
                    alt={match.p2.player.player.full_name}
                    src={`https://www.atptour.com/-/media/alias/player-headshot/${match.p2.player.player.id}`}
                    size={100}
                    className="border-zinc-300"
                  />
                  <Row className="my-5">
                    <Col span={4}>
                      <Image
                        alt={match.p2.player.player.country.name}
                        src={`/flags/${match.p2.player.player.country.id}.svg`}
                        className="rounded border-zinc-300 border-2"
                      />
                    </Col>
                    <Col span={19} className="text-xl pl-5">
                      {match.p2.player.player.full_name}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <ServiceStats
                p1Aces={match.p1.aces}
                p2Aces={match.p2.aces}
                p1Dfs={match.p1.dfs}
                p2Dfs={match.p2.dfs}
                p1Serve1Win={match.p1.serve1_pts_w}
                p1Serve1={match.p1.serve1_pts}
                p1Serve2Win={match.p1.serve2_pts_w}
                p1Serve2={match.p1.serve2_pts}
                p2Serve1Win={match.p2.serve1_pts_w}
                p2Serve1={match.p2.serve1_pts}
                p2Serve2Win={match.p2.serve2_pts_w}
                p2Serve2={match.p2.serve2_pts}
                p1BpsSaved={match.p1.bps_saved}
                p1BpsFaced={match.p1.bps_faced}
                p2BpsSaved={match.p2.bps_saved}
                p2BpsFaced={match.p2.bps_faced}
              />

              <ReturnStats
                p1Ret1Win={match.p1.ret1_w}
                p1Ret1={match.p1.ret1}
                p2Ret1Win={match.p2.ret1_w}
                p2Ret1={match.p2.ret1}
                p1Ret2Win={match.p1.ret2_w}
                p1Ret2={match.p1.ret2}
                p2Ret2Win={match.p2.ret2_w}
                p2Ret2={match.p2.ret2}
                p1BpsConverted={match.p1.bps_converted}
                p1BpOpps={match.p1.bp_opps}
                p2BpsConverted={match.p2.bps_converted}
                p2BpOpps={match.p2.bp_opps}
              />

              <PointStats match={match} />
              {match.p1.max_speed_kph && (
                <ServeSpeed
                  p1Max={match.p1.max_speed_kph}
                  p1Avg1={match.p1.avg_sv1_kph}
                  p1Avg2={match.p1.avg_sv2_kph}
                  p2Max={match.p2.max_speed_kph}
                  p2Avg1={match.p2.avg_sv1_kph}
                  p2Avg2={match.p2.avg_sv2_kph}
                />
              )}
            </ConfigProvider>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${unencodeName(tname)} ${year} ${mid}`}</title>
      </Helmet>
      <Title title={`${unencodeName(tname)} ${year} ${mid}`} />
      <Loading loading={loading} none="No data available" />
    </>
  );
}
