export const formatDifference = (difference) => {
  return difference === 0
    ? "--"
    : difference > 0
    ? `+${difference}`
    : `${difference}`;
};
