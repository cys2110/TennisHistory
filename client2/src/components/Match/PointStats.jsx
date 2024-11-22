import { Card, Row } from "antd";
import ComparisonChart from "./ComparisonChart";
import NestedChart from "./NestedChart";
import DoubleNestedChart from "./DoubleNestedChart";
import DoughnutChart from "./DoughnutChart";

export default function PointStats({ match }) {
  const comparisonData = [];
  if (match.p1.net) {
    comparisonData.push({
      name: "Net Points Won",
      p1Value: match.p1.net_w,
      p1Max: match.p1.net,
      p2Value: match.p2.net_w,
      p2Max: match.p2.net,
    });
  }
  comparisonData.push({
    name: "Service Points Won",
    p1Value: match.p1.serve1_pts_w + match.p1.serve2_pts_w,
    p1Max: match.p1.serve1_pts + match.p1.serve2_pts,
    p2Value: match.p2.serve1_pts_w + match.p2.serve2_pts_w,
    p2Max: match.p2.serve1_pts + match.p2.serve2_pts,
  });
  comparisonData.push({
    name: "Return Points Won",
    p1Value: match.p1.ret1_w + match.p1.ret2_w,
    p1Max: match.p1.ret1 + match.p1.ret2,
    p2Value: match.p2.ret1_w + match.p2.ret2_w,
    p2Max: match.p2.ret1 + match.p2.ret2,
  });

  const pieCharts = () => {
    if (match.p1.winners && match.p1.ues) {
      return (
        <DoubleNestedChart
          p1Nested={match.p1.ues}
          p1Middle={match.p1.winners}
          p1Outer={
            match.p1.serve1_pts_w +
            match.p1.serve2_pts_w +
            match.p1.ret1_w +
            match.p1.ret2_w
          }
          p2Nested={match.p2.ues}
          p2Middle={match.p2.winners}
          p2Outer={
            match.p2.serve1_pts_w +
            match.p2.serve2_pts_w +
            match.p2.ret1_w +
            match.p2.ret2_w
          }
        />
      );
    } else if (match.p1.winners || match.p1.ues) {
      return (
        <NestedChart
          p1Nested={match.p1.ues ?? match.p1.winners}
          p1Outer={
            match.p1.serve1_pts_w +
            match.p1.serve2_pts_w +
            match.p1.ret1_w +
            match.p1.ret2_w
          }
          p2Nested={match.p2.ues ?? match.p2.winners}
          p2Outer={
            match.p2.serve1_pts_w +
            match.p2.serve2_pts_w +
            match.p2.ret1_w +
            match.p2.ret2_w
          }
          outerName="Total Points Won"
          nestedName={match.p1.ues ? "Unforced Errors" : "Winners"}
        />
      );
    } else {
      return (
        <DoughnutChart
          p1Value={
            match.p1.serve1_pts_w +
            match.p1.serve2_pts_w +
            match.p1.ret1_w +
            match.p1.ret2_w
          }
          p2Value={
            match.p2.serve1_pts_w +
            match.p2.serve2_pts_w +
            match.p2.ret1_w +
            match.p2.ret2_w
          }
        />
      );
    }
  };
  return (
    <Card
      id="points-stats"
      title="POINT STATS"
      className="my-10"
      bordered={false}
    >
      <Row>
        {pieCharts()}
        {comparisonData.map((stat) => {
          return <ComparisonChart key={stat.name} stat={stat} />;
        })}
      </Row>
    </Card>
  );
}
