'use strict';

const config = {
  // Change this to be the same as your ITL entrant id
  entrantId: 41,
 
  endpoint: "https://itl2023.groovestats.com/api/entrant/",

  // Use this to override the name that displays on the widget
  // Useful if your ITL/GS name is over 11 characters
  overrideName: "",

  // Use this to override the avatar source
  // Useful if you want to use a non-png file as an avatar
  avatarSource: "",
}

const e = React.createElement;
const defaultState = {
  "entrant": {
    "id": "--",
    "name": "---",
    "rank": "---",
    "rankingPoints": "--",
    "totalPoints": "--",
    "totalPass": "---",
    "totalFC": "--",
    "totalFec": "--",
    "totalQuad": "--",
    "totalQuint": "--",
    "jackLevel": "-",
    "crossoverLevel": "-",
    "bracketLevel": "-",
    "footswitchLevel": "-",
    "sideswitchLevel": "-",
    "doublestepLevel": "-",
    "staminaLevel": "-",
  },
  "ladder": [
    {"rank": "--", "name": "--", "rankingPoints": 0, "difference": 0, "type": "neutral"},
    {"rank": "--", "name": "--", "rankingPoints": 0, "difference": 0, "type": "neutral"},
    {"rank": "--", "name": "--", "rankingPoints": 0, "difference": 0, "type": "neutral"},
    {"rank": "--", "name": "--", "rankingPoints": 0, "difference": 0, "type": "neutral"},
    {"rank": "--", "name": "--", "rankingPoints": 0, "difference": 0, "type": "neutral"},
    {"rank": "--", "name": "--", "rankingPoints": 0, "difference": 0, "type": "neutral"},
  ]
}

class ITLWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
    getInfo.bind(this)();
    this.interval = setInterval(getInfo.bind(this), 60*1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    var entrantName = e('div', {className: "entrant-name"},
        (config.overrideName == "" ? this.state.entrant.name : config.overrideName)
    )

    var entrantInfo = e('div', {className: "entrant-info"},
      e('div', {className: "entrant-id"},
        e('div', null, "ID: " + this.state.entrant.id),
      ),
      e('div', {className: "entrant-rank"},
        e('div', null, "Rank: " + this.state.entrant.rank),
      ),
      e('div', {className: "entrant-points"},
        e('div', null, "RP:"),
        e('div', null, ""),
        e('div', null, this.state.entrant.rankingPoints),
      ),
      e('div', {className: "entrant-points"},
        e('div', null, "TP:"),
        e('div', null, ""),
        e('div', null, this.state.entrant.totalPoints),
      ),
    )

    var songInfo = e('div', {className: "clear-info"},
      e('div', {className: "passes"},
        e('div', null, "Passes:"),
        e('div', null, this.state.entrant.totalPass)
      ),
      e('div', {className: "fcs"},
        e('div', null, "FCs:"),
        e('div', null, this.state.entrant.totalFC)
      ),
      e('div', {className: "fecs"},
        e('div', null, "FECs:"),
        e('div', null, this.state.entrant.totalFec)
      ),
      e('div', {className: "quads"},
        e('div', null, "Quads:"),
        e('div', null, this.state.entrant.totalQuad)
      ),
      e('div', {className: "quints"},
        e('div', null, "Quints:"),
        e('div', null, this.state.entrant.totalQuint)
      ),
    )

    var techLevelInfo = e('div', {className: "tech-level-info"},
      e('div', {className: "bracket"},
        e('div', null, "BR:"),
        e('div', null, this.state.entrant.bracketLevel),
      ),
      e('div', {className: "crossover"},
        e('div', null, "XO:"),
        e('div', null, this.state.entrant.crossoverLevel),
      ),
      e('div', {className: "footswitch"},
        e('div', null, "FS:"),
        e('div', null, this.state.entrant.footswitchLevel),
      ),
      e('div', {className: "jack"},
        e('div', null, "JA:"),
        e('div', null, this.state.entrant.jackLevel),
      ),
      e('div', {className: "sideswitch"},
        e('div', null, "SS:"),
        e('div', null, this.state.entrant.sideswitchLevel),
      ),
      e('div', {className: "doublestep"},
        e('div', null, "DS:"),
        e('div', null, this.state.entrant.doublestepLevel),
      ),
      e('div', {className: "stamina"},
        e('div', null, "ST:"),
        e('div', null, this.state.entrant.staminaLevel),
      ),
    )

    var ladderEntries = this.state.ladder.map((item, index) =>
      e('div', {'key': index, className: item.type}, 
        e('div', {className: "ladder-rank"}, item.rank + ". " + item.name),
        e('div', {}, formatDifference(item.difference))
      )
    );

    var ladder = e('div', {className: "ladder"}, 
      e('div', {className: "ladder-title"}, "ITL Ladder"),
      ladderEntries
    );

    return e('div', {className: "wrapper"}, 
      e('div', {className: "profile-picture"},
        e('img', {src: (config.avatarSource == "" ? "Avatar.png" : config.avatarSource), "object-fit": "contain", width: "100px", height: "100px"}, null)
      ),
      entrantName,
      entrantInfo,
      songInfo,
      techLevelInfo,
      ladder
    )
  }
}

function getInfo() {
  fetch(config.endpoint + config.entrantId + "/stats")
    .then((response) => {
      if (response.ok) { 
        var json = response.json();
        return json;
       }
      return Promise.reject(response); 
    })
    .then((json) => {
        var data = json["data"]

        // calculate the ranking points difference between the entrant_id and the rest of the ladder
        for (var i = 0; i < 6; i++) { 
          data["ladder"][i]['difference'] = data["entrant"]["rankingPoints"] - data["ladder"][i]['rankingPoints'];
        }

        return data;
    })
    .then((data) => {
      this.setState(data);
    })
    .catch((error) => {
      console.error('Error', error);
    })
}

function formatDifference(diff) {
  if (diff == 0) {
    return "--";
  } 
  else if (diff > 0) {
    return "+" + diff;
  }
  else {
    return diff;
  }
}

var domContainer = document.querySelector('.entrant');
ReactDOM.render(React.createElement(ITLWidget), domContainer);
