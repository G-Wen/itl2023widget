'use strict';

const config = {
  // Change this to be the same as your ITL entrant id
  entrant_id: 41,
 
  endpoint: "https://itl2023.groovestats.com/api/widget/",

  // Use this to override the name that displays on the widget
  // Useful if your ITL/GS name is over 11 characters
  override_name: "",

  // Use this to override the avatar source
  // Useful if you want to use a non-png file as an avatar
  avatar_source: "",
}

const e = React.createElement;
const default_state = {"id":"--","name":"--","ranking_points":"--","total_points":"--","song_points":"--","bonus_points":"--","passes":"---","full_combos":"--","full_excellent_combos":"--","quad_stars":"--","quint_stars":"-","rival1":null,"rival2":null,"rival3":null,"rank":"---","ladder":[]};

class ITLWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = default_state;
  }

  componentDidMount() {
    get_info.bind(this)();
    this.interval = setInterval(get_info.bind(this), 60*1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    var entrant_name = e('div', {className: "entrant_name"}, 
        (config.override_name == "" ? this.state.name : config.override_name)
    )

    var entrant_info = e('div', {className: "entrant_info"}, 
      e('div', {className: "entrant_id"},
        e('div', null, "ID: " + this.state.id),
      ),
      e('div', {className: "entrant_rank"},
        e('div', null, "Rank: " + this.state.rank),
      ),
      e('div', {className: "entrant_points"}, 
        e('div', null, "RP:"),
        e('div', null, ""),
        e('div', null, this.state.rankingPoints),
      ),
      e('div', {className: "entrant_points"}, 
        e('div', null, "TP:"),
        e('div', null, ""),
        e('div', null, this.state.totalPoints),
      ),
    )

    var song_info = e('div', {className: "clear_info"}, 
      e('div', {className: "passes"},
        e('div', null, "Passes:"),
        e('div', null, this.state.totalPass)
      ),
      e('div', {className: "fcs"},
        e('div', null, "FCs:"),
        e('div', null, this.state.totalFC)
      ),
      e('div', {className: "fecs"},
        e('div', null, "FECs:"),
        e('div', null, this.state.totalFec)
      ),
      e('div', {className: "quads"},
        e('div', null, "Quads:"),
        e('div', null, this.state.totalQuad)
      ),
      e('div', {className: "quints"},
        e('div', null, "Quints:"),
        e('div', null, this.state.totalQuint)
      ),
    )

    var tech_level_info = e('div', {className: "tech_level_info"}, 
      e('div', {className: "crossover"},
        e('div', null, "XO:"),
        e('div', null, this.state.crossoverLevel),
      ),
      e('div', {className: "bracket"},
        e('div', null, "BR:"),
        e('div', null, this.state.bracketLevel),
      ),
      e('div', {className: "footswitch"},
        e('div', null, "FS:"),
        e('div', null, this.state.footswitchLevel),
      ),
      e('div', {className: "jack"},
        e('div', null, "JA:"),
        e('div', null, this.state.jackLevel),
      ),
      e('div', {className: "sideswitch"},
        e('div', null, "SS:"),
        e('div', null, this.state.sideswitchLevel),
      ),
      e('div', {className: "doublestep"},
        e('div', null, "DS:"),
        e('div', null, this.state.doublestepLevel),
      ),
    )

    var ladder_entries = this.state.ladder.map((item, index) =>
      e('div', {'key': index, className: item.type}, 
        e('div', {className: "ladder_rank"}, item.rank + ". " + item.name),
        e('div', {}, format_difference(item.difference))
      )
    );

    var ladder = e('div', {className: "ladder"}, 
      e('div', {className: "ladder_title"}, "ITL Ladder"),
      ladder_entries
    );

    return e('div', {className: "wrapper"}, 
      e('div', {className: "profile_picture"}, 
        e('img', {src: (config.avatar_source == "" ? "Avatar.png" : config.avatar_source), "object-fit": "contain", width: "100px", height: "100px"}, null)
      ),
      entrant_name,
      entrant_info, 
      song_info,
      tech_level_info,
      ladder
    )
  }
}

function get_info() {
  fetch(config.endpoint + config.entrant_id)
    .then((response) => {
      if (response.ok) { 
        var data = response.json();
        
        // calculate the ranking points difference between the entrant_id and the rest of the ladder
        for (var i = 0; i < 6; i++) { 
          data.ladder[i]['difference'] = data.rankingPoints - data.ladder[i]['rankingPoints'];
        }

        return data;
       }
      return Promise.reject(response); 
    })
    .then((data) => {
      this.setState(data);
    })
    .catch((error) => {
      console.error('Error', error);
    })
}

function format_difference(diff) {
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
