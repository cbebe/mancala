const updatePlayers = (players, currentPlayer) => {
  if (players[currentPlayer] === undefined) players[currentPlayer] = 1;
  else ++players[currentPlayer];
  return players;
};

const updateMostRecent = (moveArray, moveObj) => {
  moveArray.unshift(moveObj);
  return moveArray.slice(0, 3);
};

const updateAfterTurn = (data, currentPlayer, side, idx) => {
  data.players = updatePlayers(data.players, currentPlayer);
  ++data.games.totalMoves;
  const move = { name: currentPlayer, side, idx };
  data.mostRecentMoves = updateMostRecent(data.mostRecentMoves, move);
  return data;
};

const updateAfterGame = (data, winner) => {
  ++data.games.totalGames;
  ++data.games[winner];
  return data;
};

module.exports = {
  updatePlayers,
  updateAfterTurn,
  updateAfterGame,
  updateMostRecent,
};
