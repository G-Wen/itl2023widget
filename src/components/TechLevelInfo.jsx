const TechLevelInfo = (props) => {
  const { entrant } = props;
  return (
    <div className="tech-level-info">
      <div>
        <div>BR:</div>
        <div>{entrant.bracketLevel}</div>
      </div>
      <div>
        <div>XO:</div>
        <div>{entrant.crossoverLevel}</div>
      </div>
      <div>
        <div>FS:</div>
        <div>{entrant.footswitchLevel}</div>
      </div>
      <div>
        <div>JA:</div>
        <div>{entrant.jackLevel}</div>
      </div>
      <div>
        <div>SS:</div>
        <div>{entrant.sideswitchLevel}</div>
      </div>
      <div>
        <div>DS:</div>
        <div>{entrant.doublestepLevel}</div>
      </div>
      <div>
        <div>ST:</div>
        <div>{entrant.staminaLevel}</div>
      </div>
    </div>
  );
};

export default TechLevelInfo;
