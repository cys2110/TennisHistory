import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { GET_MATCH_STATS } from "../../services/MatchStatService";
import Title from "../Global/Title";
import { unencodeName } from "../../utils/utils";
import Loading from "../Global/Loading";
import EventBreadcrumbs from "../Event/EventBreadcrumbs";
import MatchBreadcrumbs from "./MatchBreadcrumbs";
import MatchDetails from "./MatchDetails";
import ScoreBox from "./ScoreBox";
import { Anchor, Avatar, Card, Col, ConfigProvider, Image, Row } from "antd";
import SingleStat from "./SingleStat";
import DualStat from "./DualStat";
import TotalStat from "./TotalStat";
import { Helmet } from "react-helmet-async";

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
          <title>{`${match.p1.player.player.full_name} v. ${match.p2.player.player.full_name}`}</title>
        </Helmet>
        <MatchBreadcrumbs
          tname={unencodeName(tname)}
          tid={tid}
          year={year}
          eid={eid}
          round={match.round.round}
          mid={mid}
        />
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
                  className="text-center bg-indigo-800 rounded-xl p-5"
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
                  className="text-center bg-emerald-700 rounded-xl p-5"
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

              <Card
                id="service-stats"
                title="SERVICE STATS"
                className="my-10"
                bordered={false}
              >
                <Row justify="space-evenly">
                  <SingleStat
                    p1={match.p1.aces}
                    p2={match.p2.aces}
                    stat="Aces"
                  />
                  <SingleStat
                    p1={match.p1.dfs}
                    p2={match.p2.dfs}
                    stat="Double Faults"
                  />
                  <DualStat
                    p1={match.p1.serve1_pts}
                    p1Total={match.p1.serve1_pts + match.p1.serve2_pts}
                    p2={match.p2.serve1_pts}
                    p2Total={match.p2.serve1_pts + match.p2.serve2_pts}
                    stat="First Serve"
                  />
                  <DualStat
                    p1={match.p1.serve1_pts_w}
                    p1Total={match.p1.serve1_pts}
                    p2={match.p2.serve1_pts_w}
                    p2Total={match.p2.serve1_pts}
                    stat="1st Serve Points Won"
                  />
                  <DualStat
                    p1={match.p1.serve2_pts_w}
                    p1Total={match.p1.serve2_pts}
                    p2={match.p2.serve2_pts_w}
                    p2Total={match.p2.serve2_pts}
                    stat="2nd Serve Points Won"
                  />
                  <DualStat
                    p1={match.p1.bps_saved}
                    p1Total={match.p1.bps_faced}
                    p2={match.p2.bps_saved}
                    p2Total={match.p2.bps_faced}
                    stat="Break Points Saved"
                  />
                </Row>
              </Card>
              <Card
                id="return-stats"
                title="RETURN STATS"
                className="my-10"
                bordered={false}
              >
                <Row justify="space-evenly">
                  <DualStat
                    p1={match.p1.ret1_w}
                    p1Total={match.p1.ret1}
                    p2={match.p2.ret1_w}
                    p2Total={match.p2.ret1}
                    stat="1st Serve Return Points Won"
                  />
                  <DualStat
                    p1={match.p1.ret2_w}
                    p1Total={match.p1.ret2}
                    p2={match.p2.ret2_w}
                    p2Total={match.p2.ret2}
                    stat="2nd Serve Return Points Won"
                  />
                  <DualStat
                    p1={match.p1.bps_converted}
                    p1Total={match.p1.bp_opps}
                    p2={match.p2.bps_converted}
                    p2Total={match.p2.bp_opps}
                    stat="Break Points Converted"
                  />
                </Row>
              </Card>
              <Card
                id="points-stats"
                title="POINT STATS"
                className="my-10"
                bordered={false}
              >
                <Row justify="space-evenly">
                  {match.p1.net_w && (
                    <DualStat
                      p1={match.p1.net_w}
                      p1Total={match.p1.net}
                      p2={match.p2.net_w}
                      p2Total={match.p2.net}
                      stat="Net Points Won"
                    />
                  )}
                  {match.p1.winners && (
                    <SingleStat
                      p1={match.p1.winners}
                      p2={match.p2.winners}
                      stat="Winners"
                    />
                  )}
                  {match.p1.ues && (
                    <SingleStat
                      p1={match.p1.ues}
                      p2={match.p2.ues}
                      stat="Unforced Errors"
                    />
                  )}
                  <DualStat
                    p1={match.p1.serve1_pts_w + match.p1.serve2_pts_w}
                    p1Total={match.p1.serve1_pts + match.p1.serve2_pts}
                    p2={match.p2.serve1_pts_w + match.p2.serve2_pts_w}
                    p2Total={match.p2.serve1_pts + match.p2.serve2_pts}
                    stat="Service Points Won"
                  />
                  <DualStat
                    p1={match.p1.ret1_w + match.p1.ret2_w}
                    p1Total={match.p1.ret1 + match.p1.ret2}
                    p2={match.p2.ret1_w + match.p2.ret2_w}
                    p2Total={match.p2.ret1 + match.p2.ret2}
                    stat="Return Points Won"
                  />
                  <TotalStat
                    p1={
                      match.p1.serve1_pts_w +
                      match.p1.serve2_pts_w +
                      match.p1.ret1_w +
                      match.p1.ret2_w
                    }
                    p2={
                      match.p2.serve1_pts_w +
                      match.p2.serve2_pts_w +
                      match.p2.ret1_w +
                      match.p2.ret2_w
                    }
                    stat="Total Points Won"
                  />
                </Row>
              </Card>
            </ConfigProvider>
            {match.p1.max_speed_kph && (
              <Row>
                <Col span={24}>SERVICE SPEED</Col>
              </Row>
            )}
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
      <EventBreadcrumbs
        tname={unencodeName(tname)}
        tid={tid}
        year={year}
        eid={eid}
      />
      <Title title={`${unencodeName(tname)} ${year} ${mid}`} />
      <Loading loading={loading} none="No data available" />
    </>
  );
}
