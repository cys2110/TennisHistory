import { Outlet, useMatch, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { GET_TOURNAMENT } from "../../services/TournamentService";
import { unencodeName } from "../../utils/utils";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import TournamentBreadcrumbs from "../Global/TournamentBreadcrumbs";
import TournamentCard from "./TournamentCard";

export default function Tournament() {
  const { tname, tid } = useParams();
  const parentPage = useMatch("/tournaments/:tname/:tid");

  const { loading, error, data } = useQuery(GET_TOURNAMENT, {
    variables: { id: parseInt(tid) },
  });
  if (error) console.error(error);

  return (
    <>
      <TournamentBreadcrumbs />
      {parentPage && (
        <>
          <Helmet>
            <title>{unencodeName(tname)} | TennisHistory</title>
          </Helmet>
          <Title title={unencodeName(tname)} />
          {data && (
            <>
              <Row justify="space-evenly" gutter={[0, 32]}>
                {data.tournaments[0].events.map((event) => {
                  return (
                    <Col span={5} key={event.id}>
                      <TournamentCard event={event} name={tname} tid={tid} />
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
          {!data && <Loading loading={loading} none="No events played" />}
        </>
      )}
      <Outlet />
    </>
  );
}
