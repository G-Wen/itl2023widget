const ClearInfo = (props) => {
  const { entrant } = props;
  return (
    <div className="clear-info">
      <div className="passes">
        <div>Passes:</div>
        <div>{entrant.totalPass}</div>
      </div>
      <div className="fcs">
        <div>FCs:</div>
        <div>{entrant.totalFc}</div>
      </div>
      <div className="fecs">
        <div>FECs:</div>
        <div>{entrant.totalFec}</div>
      </div>
      <div className="quads">
        <div>Quads:</div>
        <div>{entrant.totalQuad}</div>
      </div>
      <div className="quints">
        <div>Quints:</div>
        <div>{entrant.totalQuint}</div>
      </div>
    </div>
  );
};

export default ClearInfo;
