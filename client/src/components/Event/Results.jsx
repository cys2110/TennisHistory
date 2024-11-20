import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Anchor, Col, Row } from "antd";
import { unencodeName } from "../../utils/utils";
import { GET_RESULTS } from "../../services/EventService";
import Loading from "../Global/Loading";
import Title from "../Global/Title";
import ResultCard from "./ResultCard";

export default function Results() {
  const { tname, tid, year, eid } = useParams();

  const { loading, error, data } = useQuery(GET_RESULTS, {
    variables: { id: parseInt(eid) },
  });
  if (error) console.log(error);

  const getAnchors = (round) => {
    return {
      key: round.number,
      href: `#${round.round}`,
      title: round.round,
    };
  };

  return (
    <>
      <Helmet>
        <title>
          Results | {unencodeName(tname)} {year}
        </title>
      </Helmet>
      <Title title="Results" />
      {data && (
        <Row>
          <Col span={4}>
            <Anchor
              offsetTop={75}
              items={data.events[0].rounds.map(getAnchors)}
            />
          </Col>
          <Col span={20}>
            {data.events[0].rounds.map((round) => {
              return (
                <div key={round.number} id={round.round}>
                  <div className="text-4xl mb-5">{round.round}</div>
                  <Row justify="space-evenly" gutter={[0, 32]}>
                    {round.matches.map((match) => {
                      return (
                        <Col span={11} key={match.match_no}>
                          <ResultCard match={match} />
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              );
            })}
          </Col>
        </Row>
      )}
      {!data && <Loading loading={loading} none="No data available" />}
    </>
  );
}
