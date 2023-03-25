const EntrantInfo = (props) => {
  const { entrant } = props;
  return (
    <div className="entrant-info">
      <div className="entrant-id">
        <div>ID: {entrant.id}</div>
      </div>
      <div className="entrant-rank">
        <div>Rank: {entrant.rank}</div>
      </div>
      <div className="entrant-points">
        <div>RP:</div>
        <div />
        <div>{entrant.rankingPoints}</div>
      </div>
      <div className="entrant-points">
        <div>TP:</div>
        <div />
        <div>{entrant.totalPoints}</div>
      </div>
    </div>
  );
};

export default EntrantInfo;
