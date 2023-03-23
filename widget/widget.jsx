import { useState, useEffect } from 'react';

const CONFIG = {
  // Change this to be the same as your ITL entrant id
  entrant_id: 41,
 
  endpoint: "https://itl2023.groovestats.com/api/entrant/",

  // Use this to override the name that displays on the widget
  // Useful if your ITL/GS name is over 11 characters
  override_name: "",

  // Use this to override the avatar source
  // Useful if you want to use a non-png file as an avatar
  avatar_source: "",
}

const REFRESH_INTERVAL = 60000 // 60 seconds in milliseconds

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
  ladder: [
    {rank: "--", name: "--", rankingPoints: 0, difference: 0, type: "neutral"},
    {rank: "--", name: "--", rankingPoints: 0, difference: 0, type: "neutral"},
    {rank: "--", name: "--", rankingPoints: 0, difference: 0, type: "neutral"},
    {rank: "--", name: "--", rankingPoints: 0, difference: 0, type: "neutral"},
    {rank: "--", name: "--", rankingPoints: 0, difference: 0, type: "neutral"},
    {rank: "--", name: "--", rankingPoints: 0, difference: 0, type: "neutral"},
  ]
}


const formatDifference = (diff) => {
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

const ITLWidget = () => {
  const [state, setState] = useState(DEFAULT_STATE);

  const getInfo = () => {
    fetch(config.endpoint + config.entrantId + "/stats")
      .then(response => {
        if (response.ok) { 
          var json = response.json();
          return json;
         }
        return Promise.reject(response); 
      })

      .then(json => {
          const data = json.data
  
          // calculate the ranking points difference between the entrant_id and the rest of the ladder
          for (let i = 0; i < 6; i++) { 
            data.ladder[i].difference = data.entrant.rankingPoints
              - data.ladder[i].rankingPoints;
          }
  
          return data;
      })
      .then(data => {
        setState(data);
      })
      .catch(error => {
        console.error('Error', error);
      })
  }

  useEffect(() => {
    // runs at component mount
    window.componentInterval = setInterval(getInfo(), REFRESH_INTERVAL);

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
        {CONFIG.override_name == "" ? state.entrant.name : CONFIG.override_name}
      </div>

      <div className="entrant-info">
        <div className="entrant-id">
          <div>ID: {state.entrant.id}</div>
        </div>
        <div className="entrant-rank">
          <div>Rank: {state.entrant.rank}</div>
        </div>
        <div className="entrant-points">
          <div>RP:</div>
          <div />
          <div>{state.entrant.rankingPoints}</div>
        </div>
        <div className="entrant-points">
          <div>TP:</div>
          <div />
          <div>{state.entrant.totalPoints}</div>
        </div>
      </div>

      <div className="clear-info">
        <div className="passes">
          <div>Passes:</div>
          <div>{state.entrant.totalPass}</div>
        </div>
        <div className="fcs">
          <div>FCs:</div>
          <div>{state.entrant.totalFc}</div>
        </div>
        <div className="fecs">
          <div>FECs:</div>
          <div>{state.entrant.totalFec}</div>
        </div>
        <div className="quads">
          <div>Quads:</div>
          <div>{state.entrant.totalQuad}</div>
        </div>
        <div className="quints">
          <div>Quints:</div>
          <div>{state.entrant.totalQuint}</div>
        </div>
      </div>

      <div className="tech-level-info">
        <div className="bracket">
          <div>BR:</div>
          <div>{state.entrant.bracketLevel}</div>
        </div>
        <div className="crossover">
          <div>XO:</div>
          <div>{state.entrant.crossoverLevel}</div>
        </div>
        <div className="footswitch">
          <div>FS:</div>
          <div>{state.entrant.footswitchLevel}</div>
        </div>
        <div className="jack">
          <div>JA:</div>
          <div>{state.entrant.jackLevel}</div>
        </div>
        <div className="sideswitch">
          <div>SS:</div>
          <div>{state.entrant.sideswitchLevel}</div>
        </div>
        <div className="doublestep">
          <div>DS:</div>
          <div>{state.entrant.doublestepLevel}</div>
        </div>
        <div className="stamina">
          <div>ST:</div>
          <div>{state.entrant.staminaLevel}</div>
        </div>
      </div>
      
      <div className="ladder">
        <div className="ladder-title">ITL Online 2023 - Leaderboard</div>
        {state.ladder.map((item, index) => {
          return (
            <div key={index} className={item.type}>
              <div className="ladder-rank">{`${item.rank} + '. ' + ${item.name}`}</div>
              <div>{formatDifference(item.difference)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("entrant"));
root.render(<ITLWidget />)