import { Link } from "react-router-dom";
import { Card, Col, Descriptions, Image, Row, Statistic } from "antd";
import { DateTime } from "luxon";
import {
  convertToFt,
  encodeName,
  formatDate,
  smallDate,
} from "../../utils/utils";

export default function PlayerDetails({ player }) {
  const { Meta } = Card;
  console.log(player);
  const statistics = [
    {
      title: "Career High",
      value: player.career_high,
      description: formatDate(player.ch_date),
    },
    {
      title: "Win-Loss",
      value: `${player.win}—${player.loss}`,
    },
    {
      title: "Titles",
      value: player.titles,
    },
    {
      title: "Prize Money",
      prefix: "$",
      value: player.pm_USD,
    },
  ];

  const descriptions = [
    {
      label: "Country",
      field: (
        <div className="flex items-center justify-center">
          <div className="w-10 mr-2">
            <Image
              alt={player.countryConnection.edges[0].node.name}
              src={`/flags/${player.countryConnection.edges[0].node.id}.svg`}
              className="rounded-lg"
            />
          </div>
          <div>{player.countryConnection.edges[0].node.name}</div>
        </div>
      ),
    },
    {
      label: "Active",
      field: (() => {
        if (player.turned_pro && player.retired) {
          return (
            <>
              <div>{player.retired.id - player.turned_pro.id} years</div>
              <div>
                {player.turned_pro.id}—{player.retired.id}
              </div>
            </>
          );
        } else if (player.turned_pro) {
          return (
            <>
              <div>
                {parseInt(DateTime.now().year) - player.turned_pro.id + 1} years
              </div>
              <div>{player.turned_pro.id}—present</div>
            </>
          );
        } else {
          return "—";
        }
      })(),
    },
    {
      label: "Age",
      field: player.dob ? (
        <>
          <div>
            {Math.floor(
              Math.abs(
                DateTime.fromISO(player.dob).diffNow("years").toObject().years
              )
            )}
          </div>
          <div>{formatDate(player.dob)}</div>
        </>
      ) : (
        "—"
      ),
    },
    {
      label: "Height",
      field: (
        <>
          <div>{player.height_cm} cm</div>
          <div>{convertToFt(player.height_cm)}</div>
        </>
      ),
    },
    {
      label: "Plays",
      field: (() => {
        switch (player.rh) {
          case true:
            return "Right-handed";
          case false:
            return "Left-handed";
          default:
            return "—";
        }
      })(),
    },
    {
      label: "Backhand",
      field: (() => {
        switch (player.bh1) {
          case true:
            return "One-handed";
          case false:
            return "Two-handed";
          default:
            return "—";
        }
      })(),
    },
    {
      label: player.coaches.length === 1 ? "Coach" : "Coaches",
      field:
        player.coaches.length > 0
          ? player.coaches.map((coach) => (
              <div key={coach.id}>
                {coach.first_name ? (
                  <Link
                    className="hover-link"
                    to={`/players/${encodeName(coach.full_name)}/${coach.id}`}
                  >
                    {coach.full_name}
                  </Link>
                ) : (
                  coach.id
                )}
              </div>
            ))
          : "—",
    },
    {
      label: "Previous Representations",
      span: 2,
      field:
        player.prev_countriesConnection.edges.length === 0
          ? "—"
          : player.prev_countriesConnection.edges.map((country) => (
              <div className="flex items-center justify-center">
                <div className="w-10 mr-2 my-3">
                  <Image
                    alt={country.node.name}
                    src={`/flags/${country.node.id}.svg`}
                    className="rounded-lg"
                  />
                </div>
                <div className="mx-2 w-48">{country.node.name}</div>
                <div className="mx-2">
                  {smallDate(country.properties.start_date)}—
                  {smallDate(country.properties.end_date)}
                </div>
              </div>
            )),
    },
  ];

  return (
    <>
      <Row justify="space-evenly" gutter={6}>
        {statistics.map((stat) => {
          return (
            <Col span={6} key={stat.title}>
              <Card className="text-center h-full flex flex-col justify-between">
                <Statistic
                  title={stat.title}
                  prefix={stat.prefix || ""}
                  value={stat.value}
                />
                {stat.description && <Meta description={stat.description} />}
              </Card>
            </Col>
          );
        })}
      </Row>
      <Descriptions
        colon={false}
        className="my-10 text-center"
        bordered
        layout="vertical"
        size="middle"
      >
        {descriptions.map((item) => {
          return (
            <Descriptions.Item
              key={item.label}
              label={item.label}
              span={item.span ?? 1}
            >
              {item.field}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </>
  );
}
