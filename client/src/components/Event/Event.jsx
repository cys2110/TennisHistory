import { Helmet } from "react-helmet-async";
import { Outlet, useMatch, useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { Anchor, Col, Row } from "antd";
import { unencodeName } from "../../utils/utils";
import { GET_EVENT } from "../../services/EventService";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import EventDetails from "./EventDetails";
import PrizeMoney from "./PrizeMoney";
import Seeds from "./Seeds";
import EntryInfo from "./EntryInfo";
import Entries from "./Entries";

export default function Event() {
  const { tname, tid, year, eid } = useParams();
  const parentPage = useMatch("/tournaments/:tname/:tid/:year/:eid");
  let event;
  let entryInfo = [];

  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { id: parseInt(eid), idString: eid },
  });
  if (data) {
    event = data.events[0];
    if (event.ldaConnection.edges.length > 0)
      entryInfo.push({
        array: event.ldaConnection.edges,
        title: "Last Direct Acceptance",
      });
    if (event.lls.length > 0)
      entryInfo.push({
        array: event.lls,
        title: "Lucky Losers",
      });
    if (event.alt.length > 0)
      entryInfo.push({
        array: event.alt,
        title: "Alternates",
      });
    if (event.wdConnection.edges.length > 0)
      entryInfo.push({
        array: event.wdConnection.edges,
        title: "Withdrawals",
      });
    if (event.retConnection.edges.length > 0)
      entryInfo.push({
        array: event.retConnection.edges,
        title: "Retirements",
      });
    if (event.woConnection.edges.length > 0)
      entryInfo.push({
        array: event.woConnection.edges,
        title: "Walkovers",
      });
    if (event.defaultedConnection.edges.length > 0)
      entryInfo.push({
        array: event.defaultedConnection.edges,
        title: "Defaults",
      });
  }
  if (error) console.error(error);

  return (
    <>
      {parentPage && (
        <>
          <Helmet>
            <title>
              {unencodeName(tname)} {year} | TennisHistory
            </title>
          </Helmet>
          <Title title="Event Overview" />
          {data && (
            <>
              <EventDetails id="details" event={event} />
              <Row justify="space-evenly" gutter={32}>
                <Col span={8}>
                  <div id="entries" className="text-4xl">
                    Entries
                  </div>
                  <Entries entries={data.entries} />
                </Col>
                <Col span={16}>
                  <PrizeMoney rounds={event.rounds} currency={event.currency} />

                  <div id="seeds" className="text-4xl">
                    Seeded Players
                  </div>
                  <Seeds seeds={event.seeds} />

                  {entryInfo.length > 0 && (
                    <>
                      <div id="entry" className="text-4xl">
                        Entry Information
                      </div>
                      <EntryInfo entryInfo={entryInfo} />
                    </>
                  )}
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
