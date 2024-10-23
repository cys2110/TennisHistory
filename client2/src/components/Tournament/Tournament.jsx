import { Col, Row } from "antd";
import { useQuery } from "@apollo/client";
import { Outlet, useMatch, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { GET_TOURNAMENT } from "../../services/TournamentService";
import { unencodeName } from "../../utils/utils";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import TournamentBreadcrumbs from "./TournamentBreadcrumbs";
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
      {parentPage && (
        <>
          <Helmet>
            <title>{unencodeName(tname)}</title>
          </Helmet>
          {data && (
            <TournamentBreadcrumbs
              name={unencodeName(tname)}
              events={data.tournaments[0].events}
            />
          )}
          <Title title={unencodeName(tname)} />
          {data && (
            <>
              <Row justify="space-evenly" gutter={[0, 32]}>
                {data.tournaments[0].events.map((event) => {
                  return (
                    <Col span={7} key={event.id}>
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
