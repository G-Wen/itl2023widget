import { formatDifference } from "../scripts/util";

const Ladder = (props) => {
  const { ladder } = props;
  return (
    <section className="ladder">
      <div>ITL Online 2023 - Leaderboard</div>
      <ul>
        {ladder.map((player, index) => {
          return (
            <li key={index} className={player.type}>
              <div className="ladder-rank">
                {player.rank}. {player.name}
              </div>
              <div>{formatDifference(player.difference)}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Ladder;
