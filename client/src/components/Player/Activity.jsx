import { useState } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Anchor, Col, Row, Select } from "antd";
import { DateTime } from "luxon";
import { unencodeName } from "../../utils/utils";
import { GET_EVENTS_PLAYED } from "../../services/PlayerService";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import ActivityCard from "./ActivityCard";

export default function Activity() {
  const { pname, pid } = useParams();
  const [selectedYear, setSelectedYear] = useState(2018);
  let years = [{ label: DateTime.now().year, value: DateTime.now().year }];
  let anchorItems = [];

  const handleYear = (value) => setSelectedYear(value);

  const { loading, error, data } = useQuery(GET_EVENTS_PLAYED, {
    variables: { id: pid, year: selectedYear },
  });
  if (error) console.error(error);

  if (data) {
    console.log(data.players[0]);
    years = Array.from(
      {
        length:
          data.players[0].years.latest - data.players[0].years.earliest + 1,
      },
      (_, index) => ({
        label: data.players[0].years.earliest + index,
        value: data.players[0].years.earliest + index,
      })
    );
    anchorItems = data.players[0].entries.map((entry) => ({
      key: entry.scores[0].match.round.event.id,
      href: entry.scores[0].match.round.event.tournament.name,
      title: entry.scores[0].match.round.event.tournament.name,
    }));
  }

  return (
    <>
      <Helmet>
        <title>Activity | {unencodeName(pname)}</title>
      </Helmet>
      <Row align="middle">
        <Col span={21}>
          <Title title="Activity" />
        </Col>
        <Col span={3}>
          <Select
            options={years}
            onChange={handleYear}
            defaultValue={selectedYear}
            className="w-[100%]"
            size="large"
          />
        </Col>
      </Row>
      {data && (
        <Row>
          <Col span={4}>
            <Anchor offsetTop={75} items={anchorItems} />
          </Col>
          <Col span={20}>
            {data.players[0].entries.map((entry) => {
              return <ActivityCard event={entry} year={selectedYear} />;
            })}
          </Col>
        </Row>
      )}
      {!data && <Loading loading={loading} none="No events played" />}
    </>
  );
}
