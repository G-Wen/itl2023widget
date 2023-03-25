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

exports.createLadder = createLadder;
exports.formatDifference = formatDifference;
