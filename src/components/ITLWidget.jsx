import { useState, useEffect } from "react";

function ITLWidget() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  const getInfo = () => {
    fetch(CONFIG.endpoint)
      .then((response) => {
        if (response.ok) {
          const json = response.json();
          return json;
        }

        return Promise.reject(response);
      })
      .then((json) => {
        const data = json.data;

        // Calculate the ranking points difference between the ENTRANT_ID and the rest of the ladder
        for (let i = 0; i < LADDER_LENGTH; i++) {
          data.ladder[i].difference =
            data.entrant.rankingPoints - data.ladder[i].rankingPoints;
        }

        setState(data);
        if (!loaded) setLoaded(true);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  useEffect(() => {
    // runs at component mount
    getInfo();
    const componentInterval = setInterval(() => getInfo(), REFRESH_INTERVAL);

    return () => {
      // runs at component un-mount
      clearInterval(componentInterval);
    };

    /* Will run once on mount, and then whenever getInfo changes (never).
      Still runs on dismount with return */
  }, [getInfo]);

  if (!loaded) return <></>;

  const { entrant, ladder } = state;

  return (
    <div className="wrapper">
      <div className="profile-picture">
        <img
          src={CONFIG.avatarSource == "" ? "Avatar.png" : CONFIG.avatarSource}
          style={{ objectFit: "contain", width: "100px", height: "100px" }}
        />
      </div>

      <div className="entrant-name">
        {CONFIG.overrideName == "" ? entrant.name : CONFIG.overrideName}
      </div>

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

      <div className="ladder">
        <div className="ladder-title">ITL Online 2023 - Leaderboard</div>
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
}

export default ITLWidget;
