import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Anchor, Col, Row } from "antd";
import { unencodeName } from "../../utils/utils";
import EventBreadcrumbs from "./EventBreadcrumbs";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import { GET_DRAW } from "../../services/EventService";

export default function Draw() {
  const { tname, tid, year, eid } = useParams();

  const { loading, error, data } = useQuery(GET_DRAW, {
    variables: { id: parseInt(eid) },
  });
  if (error) console.error(error);
  if (data) console.log(data);

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
          Draw | {unencodeName(tname)} {year}
        </title>
      </Helmet>
      <EventBreadcrumbs
        tname={unencodeName(tname)}
        tid={tid}
        year={year}
        eid={eid}
      />
      <Title title="Draw" />
      {data && (
        <>
          <Anchor
            items={data.events[0].rounds.map(getAnchors)}
            direction="horizontal"
          />
          <Row wrap={false}>
            {data.events[0].rounds.map((round) => {
              return (
                <Col span={11} key={round.number} id={round.round}>
                  {round.round}
                </Col>
              );
            })}
          </Row>
        </>
      )}
      {!data && <Loading loading={loading} none="No data available" />}
    </>
  );
}
