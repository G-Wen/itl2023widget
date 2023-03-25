const ENTRANT_ID = 41;

export const LADDER_LENGTH = 6;
export const REFRESH_INTERVAL = 60000; // 60 seconds in milliseconds

const EMPTY_LADDER_ENTRY = {
  rank: "--",
  name: "--",
  rankingPoints: 0,
  difference: 0,
  type: "neutral",
};

const createLadder = (num) => {
  const ladderArray = [];
  for (let i = 0; i < num; i++) {
    ladderArray.push(EMPTY_LADDER_ENTRY);
  }
  return ladderArray;
};

export const config = {
  /* Change the number here to be the same as your ITL entrant id
  ex. ENTRANT_ID = 99; */

  endpoint: `https://itl2023.groovestats.com/api/entrant/${ENTRANT_ID}/stats`,

  /* Use this to override the name that displays on the widget.
  Useful if your ITL/GS name is over 11 characters, or if you prefer
  a different handle. */
  overrideName: "",

  /* Use this to override the avatar source.
  Useful if you want to use a non-png file as an avatar.
  Format should be a URL. ex. "https://giphy.com/imageurl.gif" */
  avatarSource: "",

  DEFAULT_STATE: {
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
  },
};
