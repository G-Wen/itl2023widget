const TechLevelInfo = (props) => {
  const { entrant } = props;
  return (
    <div className="tech-level-info">
      <div className="bracket">
        <div>BR:</div>
        <div>{entrant.bracketLevel}</div>
      </div>
      <div className="crossover">
        <div>XO:</div>
        <div>{entrant.crossoverLevel}</div>
      </div>
      <div className="footswitch">
        <div>FS:</div>
        <div>{entrant.footswitchLevel}</div>
      </div>
      <div className="jack">
        <div>JA:</div>
        <div>{entrant.jackLevel}</div>
      </div>
      <div className="sideswitch">
        <div>SS:</div>
        <div>{entrant.sideswitchLevel}</div>
      </div>
      <div className="doublestep">
        <div>DS:</div>
        <div>{entrant.doublestepLevel}</div>
      </div>
      <div className="stamina">
        <div>ST:</div>
        <div>{entrant.staminaLevel}</div>
      </div>
    </div>
  );
};

export default TechLevelInfo;
