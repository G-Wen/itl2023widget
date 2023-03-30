import { useState, useEffect } from "react";

/* Change the number here to be the same as your ITL entrant id
  ex. ENTRANT_ID = 99; */
const ENTRANT_ID = 41;

/* Use this to override the name that displays on the widget.
  Useful if your ITL/GS name is over 11 characters, or if you prefer
  a different handle. */
const OVERRIDE_NAME = "";
  
/* Use this to override the avatar source.
  Useful if you want to use a non-png file as an avatar.
  Format should be a URL. ex. "https://giphy.com/imageurl.gif" */
const AVATAR_SOURCE = "";

const EMPTY_LADDER_ENTRY = {
  rank: "--",
  name: "--",
  rankingPoints: 0,
  difference: 0,
  type: "neutral",
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

const CONFIG = {
  endpoint: `https://itl2023.groovestats.com/api/entrant/${ENTRANT_ID}/stats`,
  overrideName: OVERRIDE_NAME,
  avatarSource: AVATAR_SOURCE,
  ladderLength: 6,
  refreshInterval: 60000, // 60 seconds in milliseconds
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

  ladder: createLadder(CONFIG.ladderLength),
};

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

  const getInfo = (signal = null) => {
    fetch(CONFIG.endpoint, { signal })
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
        for (let i = 0; i < CONFIG.ladderLength; i++) {
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

        entrant.totalTechLevel = entrant.techLevels.reduce((a, b) => a + b, 0);

        setState({
          entrant,
          ladder,
        });
        drawGrooveRadar(entrant);
        setLoaded(true);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Aborted!", error)
        } else {
          console.log("Error", error)
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getInfo(signal);
    const refreshInterval = setInterval(() => getInfo(), CONFIG.refreshInterval);

    return () => {
      controller.abort();
      clearInterval(refreshInterval);
    };
  }, []);

  if (!loaded) return <></>;

  const { entrant, ladder } = state;

  return (
    <section className='wrapper'>
      <img
        className='profile-picture'
        src={CONFIG.avatarSource == "" ? "Avatar.png" : CONFIG.avatarSource}
      />
      <h2>
        {CONFIG.overrideName == "" ? entrant.name : CONFIG.overrideName}
      </h2>

      <ul className='entrant-info'>
        <li className='entrant-rank'>
          <span>Rank: </span>
          <span>{entrant.rank}</span>
        </li>
        <li>
          <span>RP:</span>
          <span>{entrant.rankingPoints}</span>
        </li>
        <li>
          <span>TP:</span>
          <span>{entrant.totalPoints}</span>
        </li>
        <li>
          <span>TTL:</span>
          <span>{entrant.totalTechLevel}</span>
        </li>
      </ul>

      <ul className='clear-info'>
        <li className='passes'>
          <span>Passes:</span>
          <span>{entrant.totalPass}</span>
        </li>
        <li className='fcs'>
          <span>FCs:</span>
          <span>{entrant.totalFc}</span>
        </li>
        <li className='fecs'>
          <span>FECs:</span>
          <span>{entrant.totalFec}</span>
        </li>
        <li className='quads'>
          <span>Quads:</span>
          <span>{entrant.totalQuad}</span>
        </li>
        <li className='quints'>
          <span>Quints:</span>
          <span>{entrant.totalQuint}</span>
        </li>
      </ul>

      <div className='tech-level-info'>
        <canvas
          id='canvas'
          className='dead-end'
          grooveRadar='special'
        />
      </div>

      <ul className='ladder'>
        <li className='ladder-title'>ITL Online 2023 - Leaderboard</li>
        {ladder.map((player, index) => {
          return (
            <li
              key={index}
              className={player.type}
            >
              <span className='ladder-rank'>
                {player.rank}. {player.name}
              </span>
              <span>{formatDifference(player.difference)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const root = ReactDOM.createRoot(document.querySelector("bgwrap"));
root.render(<ITLWidget />);