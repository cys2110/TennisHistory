import { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_PLAYER_STATS } from "../../services/PlayerService";
import { Helmet } from "react-helmet-async";
import { percentage, unencodeName } from "../../utils/utils";
import Title from "../Global/Title";
import Loading from "../Global/Loading";
import { Col, Descriptions, Progress, Row, Select, Statistic } from "antd";

export default function PlayerStats() {
  const { pname, pid } = useParams();
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSurface, setSelectedSurface] = useState(null);
  let years = [{ label: "Career", value: null }];
  let stats;
  const surfaces = [
    {
      label: "All",
      value: null,
    },
    {
      label: "Clay",
      value: "Clay",
    },
    {
      label: "Grass",
      value: "Grass",
    },
    {
      label: "Hard",
      value: "Hard",
    },
    {
      label: "Carpet",
      value: "Carpet",
    },
  ];

  const handleSurface = (value) => setSelectedSurface(value);
  const handleYear = (value) => setSelectedYear(value);

  const { loading, error, data } = useQuery(GET_PLAYER_STATS, {
    variables: { id: pid, year: selectedYear, surface: selectedSurface },
  });
  if (error) console.error(error);
  if (data) {
    console.log(data.players[0]);
    stats = data.players[0].stats;
    const yearsArray = Array.from(
      {
        length:
          data.players[0].years.latest - data.players[0].years.earliest + 1,
      },
      (_, index) => ({
        label: data.players[0].years.earliest + index,
        value: data.players[0].years.earliest + index,
      })
    );
    years = [years, ...yearsArray];
  }

  return (
    <>
      <Helmet>
        <title>Stats | {unencodeName(pname)}</title>
      </Helmet>
      <Row align="middle">
        <Col span={18}>
          <Title title="Player Stats" />
        </Col>
        <Col span={3}>
          <Select
            options={years}
            onChange={handleYear}
            defaultValue={selectedYear}
            className="w-[90%] text-center mx-1"
            size="large"
          />
        </Col>
        <Col span={3}>
          <Select
            options={surfaces}
            onChange={handleSurface}
            defaultValue={selectedSurface}
            className="w-[90%] text-center"
            size="large"
          />
        </Col>
      </Row>
      {data && (
        <Descriptions colon={false} column={2} bordered size="middle">
          <Descriptions.Item label="Aces">{stats.aces}</Descriptions.Item>
          <Descriptions.Item label="1st serve return points won">
            <Progress
              percent={percentage(stats.ret1_w, stats.ret1).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Double faults">
            {stats.dfs}
          </Descriptions.Item>
          <Descriptions.Item label="2nd serve return points won">
            <Progress
              percent={percentage(stats.ret2_w, stats.ret2).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="1st serve">
            <Progress
              percent={percentage(
                stats.serve1,
                stats.serve1 + stats.serve2
              ).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Break point opportunities">
            {stats.bp_opps}
          </Descriptions.Item>
          <Descriptions.Item label="1st serve points won">
            <Progress
              percent={percentage(stats.serve1_w, stats.serve1).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Break points converted">
            <Progress
              percent={percentage(stats.bps_converted, stats.bp_opps).toFixed(
                0
              )}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="2nd serve points won">
            <Progress
              percent={percentage(stats.serve2_w, stats.serve2).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Service points won">
            <Progress
              percent={percentage(
                stats.serve1_w + stats.serve2_w,
                stats.serve1 + stats.serve2
              ).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Break points faced">
            {stats.bps_faced}
          </Descriptions.Item>
          <Descriptions.Item label="Return points won">
            <Progress
              percent={percentage(
                stats.ret1_w + stats.ret2_w,
                stats.ret1 + stats.ret2
              ).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Break points won">
            <Progress
              percent={percentage(stats.bps_saved, stats.bps_faced).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Total points won">
            <Progress
              percent={percentage(
                stats.serve1_w + stats.serve2_w + stats.ret1_w + stats.ret2_w,
                stats.serve1 + stats.serve2 + stats.ret1 + stats.ret2
              ).toFixed(0)}
              size={{ width: 400 }}
              strokeColor="#15803d"
            />
          </Descriptions.Item>
        </Descriptions>
      )}
      {!data && <Loading loading={loading} none="No data available" />}
    </>
  );
}
