import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Anchor, Col, Row } from "antd";
import { Outlet, useMatch, useParams } from "react-router";
import { unencodeName } from "../../utils/utils";
import { GET_EVENT } from "../../services/EventService";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import EventBreadcrumbs from "./EventBreadcrumbs";
import EventDetails from "./EventDetails";
import PrizeMoney from "./PrizeMoney";
import Seeds from "./Seeds";
import Reason from "./ReasonTable";
import LdaTable from "./LdaTable";
import LLTable from "./LLTable";

export default function Event() {
  const { tname, tid, year, eid } = useParams();
  const parentPage = useMatch("/tournaments/:tname/:tid/:year/:eid");
  let event;

  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { id: parseInt(eid) },
  });
  if (data) event = data.events[0];
  if (error) console.error(error);

  return (
    <>
      {parentPage && (
        <>
          <Helmet>
            <title>
              {unencodeName(tname)} {year}
            </title>
          </Helmet>
          <EventBreadcrumbs
            tname={unencodeName(tname)}
            tid={tid}
            year={year}
            eid={eid}
          />
          <Title title="Event Overview" />
          {data && (
            <Row>
              <Col span={4}>
                <Anchor
                  offsetTop={75}
                  items={[
                    {
                      key: "2",
                      href: "#awards",
                      title: "Awards",
                    },
                    event.seeds.length > 0 && {
                      key: "3",
                      href: "#seeds",
                      title: "Seeds",
                    },
                    {
                      key: "11",
                      href: "#entry",
                      title: "Entry Information",
                      children: [
                        event.ldaConnection.edges.length > 0 && {
                          key: "4",
                          href: "#lda",
                          title: "Last Direct Acceptance",
                        },
                        event.lls.length > 0 && {
                          key: "5",
                          href: "#lls",
                          title: "Lucky Losers",
                        },
                        event.alt.length > 0 && {
                          key: "6",
                          href: "#alts",
                          title: "Alternates",
                        },
                        event.wdConnection.edges.length > 0 && {
                          key: "7",
                          href: "#wds",
                          title: "Withdrawals",
                        },
                        event.retConnection.edges.length > 0 && {
                          key: "8",
                          href: "#ret",
                          title: "Retirements",
                        },
                        event.woConnection.edges.length > 0 && {
                          key: "9",
                          href: "#wos",
                          title: "Walkovers",
                        },
                        event.defaultedConnection.edges.length > 0 && {
                          key: "10",
                          href: "#defs",
                          title: "Defaults",
                        },
                      ].filter(Boolean),
                    },
                  ].filter(Boolean)}
                />
              </Col>
              <Col span={20}>
                <EventDetails id="details" event={event} />

                <PrizeMoney rounds={event.rounds} currency={event.currency} />

                <div className="flex">
                  {event.seeds.length > 0 && (
                    <div className="mr-2">
                      <div id="seeds" className="text-4xl">
                        Seeded Players
                      </div>
                      <Seeds seeds={event.seeds} />
                    </div>
                  )}
                  <div className="ml-2">
                    <div id="entry" className="text-4xl">
                      Entry Information
                    </div>
                    {event.ldaConnection.edges.length > 0 && (
                      <LdaTable players={event.ldaConnection.edges} />
                    )}
                    {event.lls.length > 0 && (
                      <LLTable
                        players={event.lls}
                        short="lls"
                        title="Lucky Losers"
                      />
                    )}
                    {event.alt.length > 0 && (
                      <LLTable
                        players={event.alt}
                        short="alts"
                        title="Alternates"
                      />
                    )}
                    {event.wdConnection.edges.length > 0 && (
                      <Reason
                        players={event.wdConnection.edges}
                        short="wds"
                        title="Withdrawals"
                      />
                    )}
                    {event.retConnection.edges.length > 0 && (
                      <Reason
                        players={event.retConnection.edges}
                        short="ret"
                        title="Retirements"
                      />
                    )}
                    {event.woConnection.edges.length > 0 && (
                      <Reason
                        players={event.woConnection.edges}
                        short="wos"
                        title="Walkovers"
                      />
                    )}
                    {event.defaultedConnection.edges.length > 0 && (
                      <Reason
                        players={event.defaultedConnection.edges}
                        short="defs"
                        title="Defaults"
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          )}
          {!data && <Loading loading={loading} none="No data available" />}
        </>
      )}
      <Outlet />
    </>
  );
}
