
export const calculateEloRating = (
  playerRating: number,
  opponentRating: number,
  outcome: number // 1 for win, 0.5 for draw, 0 for loss
): number => {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(playerRating + K * (outcome - expectedScore));
};
