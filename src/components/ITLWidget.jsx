import { useState, useEffect } from "react";
import { config, LADDER_LENGTH, REFRESH_INTERVAL } from "../scripts/config";

// COMPONENT IMPORTS
import ClearInfo from "./ClearInfo";
import EntrantInfo from "./EntrantInfo";
import EntrantName from "./EntrantName";
import Ladder from "./Ladder";
import ProfilePicture from "./ProfilePicture";
import TechLevelInfo from "./TechLevelInfo";

function ITLWidget() {
  const [state, setState] = useState(config.DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  const getInfo = () => {
    fetch(config.endpoint)
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
      <ProfilePicture
        url={config.avatarSource == "" ? "Avatar.png" : config.avatarSource}
      />
      <EntrantName
        name={config.overrideName == "" ? entrant.name : config.overrideName}
      />
      <EntrantInfo entrant />
      <ClearInfo entrant />
      <TechLevelInfo entrant />
      <Ladder ladder />
    </div>
  );
}

export default ITLWidget;
