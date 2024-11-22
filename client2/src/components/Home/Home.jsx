import { useQuery } from "@apollo/client";
import { DateTime } from "luxon";
import { Col, Row } from "antd";
import { GET_UPCOMING } from "../../services/EventService";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import EventCard from "../Global/EventCard";

export default function Home() {
  const { loading, error, data } = useQuery(GET_UPCOMING, {
    variables: { date: DateTime.now().toISODate() },
  });
  if (error) console.error(error);

  return (
    <>
      <Title title="Upcoming Events" />
      {data && data.events.length > 0 && (
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
      {(!data || data.events.length === 0) && (
        <Loading loading={loading} none="No upcoming events" />
      )}
    </>
  );
}
