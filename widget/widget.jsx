import { useState, useEffect } from "react";

/* Change the number here to be the same as your ITL entrant id
  ex. ENTRANT_ID = 99; */
const ENTRANT_ID = 41;

const REFRESH_INTERVAL = 60000; // 60 seconds in milliseconds

const CONFIG = {
  endpoint: `https://itl2023.groovestats.com/api/entrant/${ENTRANT_ID}/stats`,

  /* Use this to override the name that displays on the widget.
    Useful if your ITL/GS name is over 11 characters, or if you prefer
    a different handle. */
  overrideName: "",

  /* Use this to override the avatar source.
    Useful if you want to use a non-png file as an avatar.
    Format should be a URL. ex. "https://giphy.com/imageurl.gif" */
  avatarSource: "",
};

const EMPTY_LADDER_ENTRY = {
  rank: "--",
  name: "--",
  rankingPoints: 0,
  difference: 0,
  type: "neutral",
};

const DEFAULT_STATE = {
  entrant: {
    id: "--",
    name: "---",
    rank: "---",
    rankingPoints: "--",
    totalPoints: "--",
    totalPass: "---",
    totalFc: "--",
    totalFec: "--",
    totalQuad: "--",
    totalQuint: "--",
    jackLevel: "-",
    crossoverLevel: "-",
    bracketLevel: "-",
    footswitchLevel: "-",
    sideswitchLevel: "-",
    doublestepLevel: "-",
    staminaLevel: "-",
  },

  ladder: createLadder(6),
};

function createLadder(num) {
  const ladderArray = [];
  for (let i = 0; i < num; i++) {
    ladderArray.push(EMPTY_LADDER_ENTRY);
  }
  return ladderArray;
}

function formatDifference(difference) {
  return difference === 0
    ? "--"
    : difference > 0
    ? `+${difference}`
    : `${difference}`;
}

function normalizeTechLevels(techLevels) {
  const maxLevel = Math.max(...techLevels, 1);
  return techLevels.map((techLevel) => techLevel / maxLevel);
}

function drawGrooveRadar(entrantInfo) {
  const canvas = document.getElementById("canvas");
  const rads = (2 * Math.PI) / 7;
  const techLabels = ["XO", "SS", "FS", "JA", "DS", "BR", "ST"];
  const techLevels = normalizeTechLevels(entrantInfo.techLevels);

  if (canvas && canvas.getContext) {
    const lightTheme =
      window
        .getComputedStyle(document.querySelector(".wrapper"))
        .getPropertyValue("background-color") == "rgba(255, 255, 255, 0.8)";
    const ctx = canvas.getContext("2d");
    ctx.font = lightTheme ? "9px sanserif" : "9px sanserif";
    ctx.fillStyle = lightTheme ? "black" : "white";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(50, 50);

    for (let i = 0; i < 8; i++) {
      let ang = rads * i - Math.PI / 2;
      let xcomp = Math.cos(ang) * 43;
      let ycomp = Math.sin(ang) * 43;
      let xval = xcomp * techLevels[i] * 0.9;
      let yval = ycomp * techLevels[i] * 0.9;
      i == 0
        ? ctx.moveTo(xval + 50, yval + 50)
        : ctx.lineTo(xval + 50, yval + 50);
      i == 0 ? null : ctx.fillText(techLabels[i % 7], xcomp + 45, ycomp + 52);
    }
    const gradient = ctx.createRadialGradient(50, 50, 10, 50, 50, 60);
    if (lightTheme) {
      gradient.addColorStop(0, "rgb(140, 140, 240, 0.4)");
      gradient.addColorStop(0.3, "rgb(100, 100, 200, 0.8)");
      gradient.addColorStop(0.6, "rgb(40, 40, 200, 0.95)");
    } else {
      gradient.addColorStop(0, "rgb(240, 240, 240, 0.4)");
      gradient.addColorStop(0.3, "rgb(240, 240, 240, 0.8)");
      gradient.addColorStop(0.6, "rgb(140, 140, 240, 0.95)");
    }
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

const ITLWidget = () => {
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
        const [entrant, ladder] = [json.data.entrant, json.data.ladder];

        // Calculate the ranking points difference between the ENTRANT_ID and the rest of the ladder
        for (let i = 0; i < LADDER_LENGTH; i++) {
          ladder[i].difference =
            entrant.rankingPoints - ladder[i].rankingPoints;
        }

        entrant.techLevels = [
          entrant.crossoverLevel,
          entrant.sideswitchLevel,
          entrant.footswitchLevel,
          entrant.jackLevel,
          entrant.doublestepLevel,
          entrant.bracketLevel,
          entrant.staminaLevel,
        ];

        setState({
          entrant,
          ladder,
        });
        drawGrooveRadar(entrant);
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  useEffect(() => {
    // runs at component mount
    getInfo();
    const refreshInterval = setInterval(() => getInfo(), REFRESH_INTERVAL);

    return () => {
      // runs at component un-mount
      clearInterval(refreshInterval);
    };

    /* Will run once on mount, and then whenever getInfo changes (never).
      Still runs on dismount with return */
  }, [getInfo]);

  if (!loaded) return <></>;

  const { entrant, ladder } = state;

  return (
    <div className='wrapper'>
      <div className='profile-picture'>
        <img
          src={CONFIG.avatarSource == "" ? "Avatar.png" : CONFIG.avatarSource}
        />
      </div>

      <div className='entrant-name'>
        {CONFIG.overrideName == "" ? entrant.name : CONFIG.overrideName}
      </div>

      <div className='entrant-info'>
        <div className='entrant-id'>
          <div>ID: {entrant.id}</div>
        </div>
        <div className='entrant-rank'>
          <div>Rank: {entrant.rank}</div>
        </div>
        <div className='entrant-points'>
          <div>RP:</div>
          <div />
          <div>{entrant.rankingPoints}</div>
        </div>
        <div className='entrant-points'>
          <div>TP:</div>
          <div />
          <div>{entrant.totalPoints}</div>
        </div>
      </div>

      <div className='clear-info'>
        <div className='passes clear-info-row'>
          <div>Passes:</div>
          <div>{entrant.totalPass}</div>
        </div>
        <div className='fcs clear-info-row'>
          <div>FCs:</div>
          <div>{entrant.totalFc}</div>
        </div>
        <div className='fecs clear-info-row'>
          <div>FECs:</div>
          <div>{entrant.totalFec}</div>
        </div>
        <div className='quads clear-info-row'>
          <div>Quads:</div>
          <div>{entrant.totalQuad}</div>
        </div>
        <div className='quints clear-info-row'>
          <div>Quints:</div>
          <div>{entrant.totalQuint}</div>
        </div>
      </div>

      <div className='tech-level-info'>
        <div
          id='canvas'
          className='dead-end'
          grooveRadar='special'
        />
      </div>

      <div className='ladder'>
        <div className='ladder-title'>ITL Online 2023 - Leaderboard</div>
        {ladder.map((player, index) => {
          return (
            <div
              key={index}
              className={player.type}
            >
              <div className='ladder-rank'>
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

const root = ReactDOM.createRoot(document.getElementById("entrant"));
root.render(<ITLWidget />);
