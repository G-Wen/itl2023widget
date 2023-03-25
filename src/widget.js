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
  
        this.setState(data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }

  componentDidMount() {
    this.getInfo();
    this.interval = setInterval(() => {this.getInfo()}, REFRESH_INTERVAL);
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
      e('div', {className: "entrant-id"},
        e('div', null, "ID: " + entrant.id),
      ),
      e('div', {className: "entrant-rank"},
        e('div', null, "Rank: " + entrant.rank),
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

    const techLevelInfo = e('div', {className: "tech-level-info"},
      e('div', {className: "bracket"},
        e('div', null, "BR:"),
        e('div', null, entrant.bracketLevel),
      ),
      e('div', {className: "crossover"},
        e('div', null, "XO:"),
        e('div', null, entrant.crossoverLevel),
      ),
      e('div', {className: "footswitch"},
        e('div', null, "FS:"),
        e('div', null, entrant.footswitchLevel),
      ),
      e('div', {className: "jack"},
        e('div', null, "JA:"),
        e('div', null, entrant.jackLevel),
      ),
      e('div', {className: "sideswitch"},
        e('div', null, "SS:"),
        e('div', null, entrant.sideswitchLevel),
      ),
      e('div', {className: "doublestep"},
        e('div', null, "DS:"),
        e('div', null, entrant.doublestepLevel),
      ),
      e('div', {className: "stamina"},
        e('div', null, "ST:"),
        e('div', null, entrant.staminaLevel),
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

    return e('div', {className: "wrapper"}, 
      e('div', {className: "profile-picture"},
        e('img', {src: (CONFIG.avatarSource == "" ? "Avatar.png" : CONFIG.avatarSource), "object-fit": "contain", width: "100px", height: "100px"}, null)
      ),
      entrantName,
      entrantInfo,
      clearInfo,
      techLevelInfo,
      ladderList
    )
  }
}

const domContainer = document.querySelector(".entrant");
ReactDOM.render(React.createElement(ITLWidget), domContainer);
