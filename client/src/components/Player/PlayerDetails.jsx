import { Card, Col, Descriptions, Image, Row, Statistic } from "antd";
import { DateTime } from "luxon";
import {
  convertToFt,
  encodeName,
  formatDate,
  smallDate,
} from "../../utils/utils";
import { Link } from "react-router-dom";

export default function PlayerDetails({ player }) {
  const { Meta } = Card;
  console.log(player);

  return (
    <>
      <Row justify="space-evenly" gutter={6}>
        <Col span={6}>
          <Card className="text-center h-full flex flex-col justify-between">
            <Statistic title="Career High" value={player.career_high} />
            <Meta description={formatDate(player.ch_date)} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="h-full flex flex-col justify-between">
            <Statistic
              title="Win-Loss"
              value={`${player.win}—${player.loss}`}
              className="text-center"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="h-full flex flex-col justify-between">
            <Statistic
              title="Titles"
              value={player.titles}
              className="text-center"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="h-full flex flex-col justify-between">
            <Statistic
              title="Prize Money"
              prefix="$"
              value={player.pm_USD}
              className="text-center"
            />
          </Card>
        </Col>
      </Row>
      <Descriptions
        colon={false}
        className="my-10 text-center"
        bordered
        layout="vertical"
        size="middle"
      >
        <Descriptions.Item label="Country">
          <div className="flex items-center justify-normal">
            <div className="w-10 mr-2">
              <Image
                alt={player.countryConnection.edges[0].node.name}
                src={`/flags/${player.countryConnection.edges[0].node.id}.svg`}
                className="rounded-lg"
              />
            </div>
            <div className="ml-2">
              {player.countryConnection.edges[0].node.name}
            </div>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Active">
          {player.turned_pro && player.retired ? (
            <div>
              <div>{player.retired.id - player.turned_pro.id} years</div>
              <div>
                {player.turned_pro.id}-{player.retired.id}
              </div>
            </div>
          ) : player.turned_pro ? (
            <div>
              <div>
                {parseInt(DateTime.now().year) - player.turned_pro.id + 1} years
              </div>
              <div>{player.turned_pro.id}-present</div>
            </div>
          ) : (
            "—"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Age">
          {player.dob ? (
            <div>
              <div>
                {Math.floor(
                  Math.abs(
                    DateTime.fromISO(player.dob).diffNow("years").toObject()
                      .years
                  )
                )}
              </div>
              <div>({formatDate(player.dob)})</div>
            </div>
          ) : (
            "—"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Height">
          <div>{player.height_cm}cm</div>
          <div>{convertToFt(player.height_cm)}</div>
        </Descriptions.Item>
        <Descriptions.Item label="Plays">
          {player.rh === true
            ? "Right-handed"
            : player.rh === false
            ? "Left-handed"
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Backhand">
          {player.bh1 === true
            ? "One-handed"
            : player.bh1 === false
            ? "Two-handed"
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Previous Representations" span={2}>
          {player.prev_countriesConnection.edges.length === 0 && "—"}
          {player.prev_countriesConnection.edges.length > 0 &&
            player.prev_countriesConnection.edges.map((country) => (
              <div className="flex items-center justify-start">
                <div className="w-10 mr-2 my-3">
                  <Image
                    alt={country.node.name}
                    src={`/flags/${country.node.id}.svg`}
                    className="rounded-lg"
                  />
                </div>

                <div className="mx-2 w-48">{country.node.name}</div>
                <div className="mx-2">
                  {smallDate(country.properties.start_date)}-
                  {smallDate(country.properties.end_date)}
                </div>
              </div>
            ))}
        </Descriptions.Item>
        <Descriptions.Item
          label={player.coaches.length === 1 ? "Coach" : "Coaches"}
        >
          {player.coaches.length > 0 &&
            player.coaches.map((coach) => (
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
            ))}
          {player.coaches.length === 0 && "—"}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
