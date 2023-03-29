"use strict";
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
}

const LADDER_LENGTH = 6;

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

  ladder: createLadder(LADDER_LENGTH),
};

function createLadder(length) {
  const ladder = [];
  for (let i = 0; i < length; i++) {
    ladder.push(EMPTY_LADDER_ENTRY)
  }
  return ladder;
}

function formatDifference(difference) {
  return difference === 0
    ? "--"
    : difference > 0
      ? `+${difference}`
      : `${difference}`;
};

const e = React.createElement;

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
        const data = json.data;
  
        // Calculate the ranking points difference between the ENTRANT_ID and the rest of the ladder
        for (let i = 0; i < LADDER_LENGTH; i++) {
          data.ladder[i].difference =
            data.entrant.rankingPoints - data.ladder[i].rankingPoints;
        }

        data.entrant.techLevels = [data.entrant.crossoverLevel, data.entrant.sideswitchLevel, data.entrant.footswitchLevel, data.entrant.jackLevel, data.entrant.doublestepLevel, data.entrant.bracketLevel, data.entrant.staminaLevel]

        data.entrant.totalTechLevel = data.entrant.techLevels.reduce((a, b) => a + b, 0);

        this.setState(data);
        drawGrooveRadar(data.entrant);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }

  componentDidMount() {
    this.getInfo();
    this.interval = setInterval(() => {
      this.getInfo(); 
    }, REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { entrant, ladder } = this.state;

    const entrantName = e('div', {className: "entrant-name"},
      (CONFIG.overrideName == "" ? entrant.name : CONFIG.overrideName)
    )

    const entrantInfo = e('div', {className: "entrant-info"},
      e('div', {className: "entrant-rank"},
        e('div', null, "Rank: "),
        e('div', null, ""),
        e('div', null, entrant.rank),
      ),
      e('div', {className: "entrant-points"},
        e('div', null, "RP:"),
        e('div', null, ""),
        e('div', null, entrant.rankingPoints),
      ),
      e('div', {className: "entrant-points"},
        e('div', null, "TP:"),
        e('div', null, ""),
        e('div', null, entrant.totalPoints),
      ),
      e('div', {className: "entrant-points"},
        e('div', null, "TTL:"),
        e('div', null, ""),
        e('div', null, entrant.totalTechLevel),
      ),
    )

    const clearInfo = e('div', {className: "clear-info"},
      e('div', {className: "passes"},
        e('div', null, "Passes:"),
        e('div', null, entrant.totalPass)
      ),
      e('div', {className: "fcs"},
        e('div', null, "FCs:"),
        e('div', null, entrant.totalFc)
      ),
      e('div', {className: "fecs"},
        e('div', null, "FECs:"),
        e('div', null, entrant.totalFec)
      ),
      e('div', {className: "quads"},
        e('div', null, "Quads:"),
        e('div', null, entrant.totalQuad)
      ),
      e('div', {className: "quints"},
        e('div', null, "Quints:"),
        e('div', null, entrant.totalQuint)
      ),
    )

    const ladderEntries = ladder.map((player, index) =>
      e('div', {'key': index, className: player.type}, 
        e('div', {className: "ladder-rank"}, `${player.rank}. ${player.name}`),
        e('div', {}, formatDifference(player.difference))
      )
    );

    const ladderList = e('div', {className: "ladder"}, 
      e('div', {className: "ladder-title"}, "ITL Online 2023 - Leaderboard"),
      ladderEntries
    );

    const grooveRadar = e('canvas', {id: "canvas", className: "groove-radar", special: true, width: 100, height: 100});

    const techLevelInfo = e('div', {className: "tech-level-info"},
      grooveRadar,
    )

    return e('div', {className: "wrapper"}, 
      e('div', {className: "profile-picture"},
        e('img', {src: (CONFIG.avatarSource == "" ? "Avatar.png" : CONFIG.avatarSource), "object-fit": "contain", width: "100px", height: "100px"}, null)
      ),
      entrantName,
      entrantInfo,
      clearInfo,
      techLevelInfo,
      ladderList,
    )
  }
}

function normalizeTechLevels(techLevels) {
  const maxLevel = Math.max(...techLevels, 1);
  return techLevels.map(techLevel => (techLevel / maxLevel));
}

function drawGrooveRadar(entrantInfo) {
  const canvas = document.getElementById("canvas");
  const rads = 2 * Math.PI / 7;
  const techLabels = ["XO", "SS", "FS", "JA", "DS", "BR", "ST"];
  const techLevels = normalizeTechLevels(entrantInfo.techLevels);

  if (canvas && canvas.getContext) {
    const lightTheme = window.getComputedStyle(document.querySelector(".wrapper")).getPropertyValue("background-color") == "rgba(255, 255, 255, 0.8)";
    const ctx = canvas.getContext("2d");
    ctx.font = lightTheme ? "9px sanserif" : "9px sanserif";
    ctx.fillStyle = lightTheme ? "black" : "white";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(50, 50);

    for (let i = 0; i < 8; i++){
      var ang = rads * i - (Math.PI/2);
      var xcomp= Math.cos(ang) * 43
      var ycomp = Math.sin(ang) * 43
      var xval= xcomp * techLevels[i] * 0.9
      var yval= ycomp * techLevels[i] * 0.9
      i == 0 ? ctx.moveTo(xval+50, yval+50) : ctx.lineTo(xval+50, yval+50);
      i == 0 ? null : ctx.fillText(techLabels[i%7], xcomp+45, ycomp+52);
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

const domContainer = document.querySelector(".entrant");
ReactDOM.render(React.createElement(ITLWidget), domContainer);
