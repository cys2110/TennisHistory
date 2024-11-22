import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { unencodeName } from "../../utils/utils";
import { useQuery } from "@apollo/client";
import { GET_INDEX } from "../../services/PlayerService";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import IndexCard from "./IndexCard";
import { Anchor, Col, Row } from "antd";

export default function Index() {
  const { pname, pid } = useParams();
  let player;

  const { loading, error, data } = useQuery(GET_INDEX, {
    variables: { id: pid },
  });
  if (data) console.log(data.players[0].index);
  if (data) player = data.players[0].index;
  if (error) console.error(error);

  return (
    <>
      <Helmet>
        <title>Win-Loss Index | {unencodeName(pname)}</title>
      </Helmet>
      <Title title="Win-Loss Index" />
      {data && (
        <Row>
          <Col span={4}>
            <Anchor
              offsetTop={75}
              items={[
                {
                  key: "match",
                  href: "#match-record",
                  title: "Match Record",
                },
                {
                  key: "pressure",
                  href: "#pressure-points",
                  title: "Pressure Points",
                },
                {
                  key: "environment",
                  href: "#environment",
                  title: "Environment",
                },
                {
                  key: "other",
                  href: "#other",
                  title: "Other",
                },
              ]}
            />
          </Col>
          <Col span={20}>
            <div className="text-3xl" id="match-record">
              Match Record
            </div>
            <Row className="my-10" gutter={16}>
              <Col span={6}>
                <IndexCard
                  label="Overall"
                  win={player.wins}
                  loss={player.losses}
                  titles={player.titles}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Grand Slams"
                  win={player.gsWins}
                  loss={player.gsLosses}
                  titles={player.gsTitles}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="ATP Masters 1000"
                  win={player.mastersWins}
                  loss={player.mastersLosses}
                  titles={player.mastersTitles}
                />
              </Col>
            </Row>
            <div className="text-3xl" id="pressure-points">
              Pressure points
            </div>
            <Row className="my-10" gutter={[16, 16]}>
              <Col span={6}>
                <IndexCard
                  label="Tie breaks"
                  win={player.tbWins}
                  loss={player.tbLosses}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Versus top 10"
                  win={player.v10Wins}
                  loss={player.v10Losses}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Finals"
                  win={player.finalsWins}
                  loss={player.finalsLosses}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Deciding set"
                  win={player.deciderWins}
                  loss={player.deciderLosses}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="5th set record"
                  win={player.set5Wins}
                  loss={player.set5Losses}
                />
              </Col>
            </Row>
            <div className="text-3xl" id="environment">
              Environment
            </div>
            <Row className="my-10" gutter={[16, 16]}>
              <Col span={6}>
                <IndexCard
                  label="Clay"
                  win={player.clayWins}
                  loss={player.clayLosses}
                  titles={player.clayTitles}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Grass"
                  win={player.grassWins}
                  loss={player.grassLosses}
                  titles={player.grassTitles}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Hard"
                  win={player.hardWins}
                  loss={player.hardLosses}
                  titles={player.hardTitles}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Carpet"
                  win={player.carpetWins}
                  loss={player.carpetLosses}
                  titles={player.carpetTitles}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Indoor"
                  win={player.indoorWins}
                  loss={player.indoorLosses}
                  titles={player.indoorTitles}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="Outdoor"
                  win={player.outdoorWins}
                  loss={player.outdoorLosses}
                  titles={player.outdoorTitles}
                />
              </Col>
            </Row>
            <div className="text-3xl" id="other">
              Other
            </div>
            <Row className="my-10" gutter={[16, 16]} justify="space-evenly">
              <Col span={6}>
                <IndexCard
                  label="After winning 1st set"
                  win={player.win1Wins}
                  loss={player.win1Losses}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="After losing 1st set"
                  win={player.lose1Wins}
                  loss={player.lose1Losses}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="vs. right handers"
                  win={player.rhWins}
                  loss={player.rhLosses}
                />
              </Col>
              <Col span={6}>
                <IndexCard
                  label="vs. left handers"
                  win={player.lhWins}
                  loss={player.lhLosses}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {!data && <Loading loading={loading} none="No data available" />}
    </>
  );
}
