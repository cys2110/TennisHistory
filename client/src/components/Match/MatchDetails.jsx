import { Descriptions } from "antd";
import { formatDate, formattedDates, formatTime } from "../../utils/utils";
import { SURFACES } from "../../utils/variables";

export default function MatchDetails({ match }) {
  const descriptionItems = [
    {
      label: "Round",
      field: match.round.round,
    },
    {
      label: "Date(s)",
      field: match.date
        ? formatDate(match.date)
        : formattedDates(
            match.round.event.start_date,
            match.round.event.end_date
          ),
    },
    {
      label: "Court",
      field: match.court ?? "—",
    },
    {
      label: "Surface",
      field: SURFACES[match.round.event.surface.id] ?? "—",
    },
    {
      label: "Duration",
      field: match.duration_mins ? formatTime(match.duration_mins) : "—",
    },
    {
      label: "Umpire",
      field: match.umpire?.id ?? "—",
    },
  ];
  return (
    <Descriptions bordered size="middle" className="my-10">
      {descriptionItems.map((item) => {
        return (
          <Descriptions.Item key={item.label} label={item.label}>
            {item.field}
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  );
}
