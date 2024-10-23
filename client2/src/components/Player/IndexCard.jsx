import { Card, Progress } from "antd";
import { percentage } from "../../utils/utils";

export default function IndexCard({ label, win, loss, titles }) {
  const { Meta } = Card;
  const display = (
    <div className="font-bold">
      <div>
        {win}-{loss}
      </div>
      <div>{win + loss === 0 ? 0 : (win / (win + loss)).toFixed(3)}</div>
    </div>
  );

  return (
    <Card className="text-center">
      <Progress
        percent={percentage(win, win + loss)}
        type="dashboard"
        format={() => display}
        className="mb-3"
      />

      <Meta
        title={label}
        description={
          titles !== undefined &&
          `${titles} ${titles === 1 ? "title" : "titles"}`
        }
      />
    </Card>
  );
}
