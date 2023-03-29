"use strict";
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

const e = React.createElement;

const EMPTY_LADDER_ENTRY = {
  rank: "--",
  name: "--",
  rankingPoints: 0,
  difference: 0,
  type: "neutral",
};

function createLadder(length) {
  const ladder = [];
  for (let i = 0; i < length; i++) {
    ladder.push(EMPTY_LADDER_ENTRY);
  }
  return ladder;
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
    totalTechLevel: "--",
    totalPass: "---",
    totalFc: "--",
    totalFec: "--",
    totalQuad: "--",
    totalQuint: "--",
    jackLevel: 0,
    crossoverLevel: 0,
    bracketLevel: 0,
    footswitchLevel: 0,
    sideswitchLevel: 0,
    doublestepLevel: 0,
    staminaLevel: 0,
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

    // idk how to draw the bounding septagon in a nice way
    /*
    ctx.moveTo(50, 50);
    for (let i = 0; i < 8; i++){
      var ang = rads * i - (Math.PI/2);
      var xcomp= Math.cos(ang) * 40
      var ycomp = Math.sin(ang) * 40
      i == 0 ? ctx.moveTo(xcomp+50, ycomp+50) : ctx.lineTo(xcomp+50, ycomp+50);
    }
    ctx.stroke();
    */
  }
}

class ITLWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  getInfo() {
    fetch(CONFIG.endpoint)
      .then((response) => {
        if (response.ok) {
          const json = response.json();
          return json;
        }
        return Promise.reject(response);
      })
      .then((json) => {
        const { entrant, ladder } = json.data;

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

        this.setState({
          entrant,
          ladder,
        });
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }

  componentDidMount() {
    this.getInfo();
    this.interval = setInterval(() => {
      this.getInfo();
    }, CONFIG.refreshInterval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { entrant, ladder } = this.state;

    const profilePicture = e("img", {
      src: CONFIG.avatarSource == "" ? "Avatar.png" : CONFIG.avatarSource,
    });

    const entrantName = e("h2", null,
      CONFIG.overrideName == "" ? entrant.name : CONFIG.overrideName
    );

    const entrantInfo = e("ul", { className: "entrant-info" },
      e("li", { className: "entrant-rank" },
        e("span", null, "Rank: "),
        e("span", null, entrant.rank)
      ),
      e("li", null,
        e("span", null, "RP:"),
        e("span", null, entrant.rankingPoints)
      ),
      e("li", null,
        e("span", null, "TP:"),
        e("span", null, entrant.totalPoints)
      ),
      e("li", null,
        e("span", null, "TTL:"),
        e("span", null, entrant.totalTechLevel)
      )
    );

    const clearInfo = e("ul", { className: "clear-info" },
      e("li", { className: "passes" },
        e("span", null, "Passes:"),
        e("span", null, entrant.totalPass)
      ),
      e("li", { className: "fcs" },
        e("span", null, "FCs:"),
        e("span", null, entrant.totalFc)
      ),
      e("li", { className: "fecs" },
        e("span", null, "FECs:"),
        e("span", null, entrant.totalFec)
      ),
      e("li", { className: "quads" },
        e("span", null, "Quads:"),
        e("span", null, entrant.totalQuad)
      ),
      e("li", { className: "quints" },
        e("span", null, "Quints:"),
        e("span", null, entrant.totalQuint)
      )
    );

    const techLevelInfo = e("div", { className: "tech-level-info" },
      e("canvas", {id: "canvas", className: "dead-end", grooveRadar: "special"})
    );

    const ladderEntries = ladder.map((player, index) =>
      e("li", { key: index, className: player.type },
        e("span", { className: "ladder-rank" }, `${player.rank}. ${player.name}`),
        e("span", {}, formatDifference(player.difference))
      )
    );

    const ladderList = e("ul", { className: "ladder" },
      e("li", { className: "ladder-title" }, "ITL Online 2023 - Leaderboard"),
      ladderEntries
    );

    /* Check if information has been acquired and state has been set before rendering grooveRadar.
      Necessary because grooveRadar relies on information acquired from backend, throws errors if not loaded. */
    if (typeof entrant.id === "number") {
      drawGrooveRadar(entrant)
    }

    return e("section", { className: "wrapper" },
      profilePicture,
      entrantName,
      entrantInfo,
      clearInfo,
      techLevelInfo,
      ladderList
    );
  }
}

const domContainer = document.querySelector(".bgwrap");
ReactDOM.render(React.createElement(ITLWidget), domContainer);
