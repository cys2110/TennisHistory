import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Row, Col, Select } from "antd";
import { DateTime } from "luxon";
import { GET_ARCHIVE } from "../../services/EventService";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import EventCard from "../Global/EventCard";

export default function Archive() {
  const [selectedYear, setSelectedYear] = useState(DateTime.now().year);
  const years = [
    {
      label: 2018,
      value: 2018,
    },
    {
      label: 2024,
      value: 2024,
    },
  ];

  const handleChange = (value) => setSelectedYear(value);

  const { loading, error, data } = useQuery(GET_ARCHIVE, {
    variables: { year: selectedYear },
  });
  if (error) console.log(error);

  return (
    <>
      <Helmet>
        <title>Results Archive</title>
      </Helmet>
      <Row align="middle" justify="space-between" className="mb-5">
        <Col xs={24} sm={20} xl={22}>
          <Title title="Results Archive" />
        </Col>
        <Col xs={24} sm={4} xl={2}>
          <Select
            showSearch
            options={years}
            onChange={handleChange}
            defaultValue={selectedYear}
            className="w-[100%] text-center"
            size="large"
          />
        </Col>
      </Row>
      {data && (
        <Row justify="space-evenly" align="stretch" gutter={[0, 32]}>
          {data.events.map((event) => {
            return (
              <Col xs={24} sm={11} md={7} xl={5} key={event.id}>
                <EventCard event={event} />
              </Col>
            );
          })}
        </Row>
      )}
      {!data && <Loading loading={loading} none="No data available" />}
    </>
  );
}
