import { formatDifference } from "../scripts/util";

const Ladder = (props) => {
  const { ladder } = props;
  return (
    <div className="ladder">
      <div className="ladder-title">ITL Online 2023 - Leaderboard</div>
      <div className="ladder-players">
        {ladder.map((player, index) => {
          return (
            <div key={index} className={player.type}>
              <div className="ladder-rank">
                {player.rank}. {player.name}
              </div>
              <div>{formatDifference(player.difference)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ladder;
