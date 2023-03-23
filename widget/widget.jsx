import { useState, useEffect } from 'react';

const CONFIG = {
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

const REFRESH_INTERVAL = 60000 // 60 seconds in milliseconds

const ITLWidget = () => {
  const [state, setState] = useState({
    id: '--',
    name: '--',
    rankingPoints: '--',
    totalPoints: '--',
    songPoints: '--',
    bonusPoints: '--',
    passes: '--',
    fullCombos: '--',
    fullExcellentCombos: '--',
    quadStars: '--',
    quintStars: '--',
    rival1: null,
    rival2: null,
    rival3: null,
    rank: '---',
    ladder: []
  });

  const format_difference = (diff) => {
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

  const get_info = () => {
    fetch(CONFIG.endpoint + CONFIG.entrant_id)
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
        setState(data);
      })
      .catch((error) => {
        console.error('Error', error);
      })
  }

  useEffect(() => {
    // runs at component mount
    window.componentInterval = setInterval(get_info(), REFRESH_INTERVAL);

    return () => {
      // runs at component un-mount
      clearInterval(window.componentInterval)
    }
  })

  return (
    <div className="wrapper">
      <div className="profile-picture">
        <img
          src={CONFIG.avatar_source == "" ? "Avatar.png" : CONFIG.avatar_source}
          style={{objectFit: 'contain', width: '100px', height: '100px'}} />
      </div>

      <div className="entrant-name">
        {CONFIG.override_name == "" ? this.state.name : CONFIG.override_name}
      </div>

      <div className="entrant-info">
        <div className="entrant-id">
          <div>ID: {state.id}</div>
        </div>
        <div className="entrant_rank">
          <div>Rank: {state.rank}</div>
        </div>
        <div className="entrant_points">
          <div>RP:</div>
          <div />
          <div>{state.rankingPoints}</div>
        </div>
        <div className="entrant_points">
          <div>TP:</div>
          <div />
          <div>{state.totalPoints}</div>
        </div>
      </div>

      <div className="clear_info">
        <div className="passes">
          <div>Passes:</div>
          <div>{state.passes}</div>
        </div>
        <div className="fcs">
          <div>FCs:</div>
          <div>{state.fullCombos}</div>
        </div>
        <div className="fecs">
          <div>FECs:</div>
          <div>{state.fullExcellentCombos}</div>
        </div>
        <div className="quads">
          <div>Quads:</div>
          <div>{state.quadStars}</div>
        </div>
        <div className="quints">
          <div>Quints:</div>
          <div>{state.quintStars}</div>
        </div>
      </div>

      <div className="tech_level_info">
        <div className="crossover">
          <div>XO:</div>
          <div>{state.crossoverLevel}</div>
        </div>
        <div className="bracket">
          <div>BR:</div>
          <div>{state.bracketLevel}</div>
        </div>
        <div className="footswitch">
          <div>FS:</div>
          <div>{state.footswitchLevel}</div>
        </div>
        <div className="jack">
          <div>JA:</div>
          <div>{state.jackLevel}</div>
        </div>
        <div className="sideswitch">
          <div>SS:</div>
          <div>{state.sideswitchLevel}</div>
        </div>
        <div className="doublestep">
          <div>DS:</div>
          <div>{state.doublestepLevel}</div>
        </div>
        <div className="stamina">
          <div>ST:</div>
          <div>{state.staminaLevel}</div>
        </div>
      </div>
      
      <div className="ladder">
        <div className="ladder-title">ITL Ladder</div>
        {state.ladder.map((item, index) => {
          return (
            <div key={index} className={item.type}>
              <div className="ladder_rank">{`${item.rank} + '. ' + ${item.name}`}</div>
              <div>{format_difference(item.difference)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("entrant"));
root.render(<ITLWidget />)