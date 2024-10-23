import { Descriptions } from "antd";
import { formatDate, formatTime } from "../../utils/utils";

export default function MatchDetails({ match }) {
  return (
    <Descriptions bordered size="middle" className="my-10">
      <Descriptions.Item label="Round">{match.round.round}</Descriptions.Item>
      {match.date && (
        <Descriptions.Item label="Date">
          {formatDate(match.date)}
        </Descriptions.Item>
      )}
      {match.court && (
        <Descriptions.Item label="Court">{match.court}</Descriptions.Item>
      )}
      <Descriptions.Item label="Surface">
        {match.round.event.surface.environment}{" "}
        {match.round.event.surface.surface}
      </Descriptions.Item>
      {match.duration_mins && (
        <Descriptions.Item label="Duration">
          {formatTime(match.duration_mins)}
        </Descriptions.Item>
      )}
      {match.umpire && (
        <Descriptions.Item label="Umpire">{match.umpire.id}</Descriptions.Item>
      )}
    </Descriptions>
  );
}
