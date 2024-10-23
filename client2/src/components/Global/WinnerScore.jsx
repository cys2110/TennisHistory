export default function WinnerScore({ winner, loser }) {
  return (
    <div>
      {winner.s1 ? `${winner.s1}${loser.s1}` : ""}
      {winner.s2 ? ` ${winner.s2}${loser.s2}` : ""}
      {winner.s3 ? ` ${winner.s3}${loser.s3}` : ""}
      {winner.s4 ? ` ${winner.s4}${loser.s4}` : ""}
      {winner.s5 ? ` ${winner.s5}${loser.s5}` : ""}
      {loser.incomplete ? ` ${loser.incomplete}.` : ""}
    </div>
  );
}
