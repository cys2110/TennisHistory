export default function ScoreItem({ score }) {
  const scoreArray = Array.from({ length: 5 }, (_, i) => i);

  return (
    <>
      {scoreArray.map((set) => {
        return (
          <div key={set} className="mr-1">
            {score[`s${set + 1}`]}
            <sup>{score[`t${set + 1}`]}</sup>
          </div>
        );
      })}
    </>
  );
}
