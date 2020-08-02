interface Players {
  [key: string]: number;
}

interface MoveObject {
  name: string;
  side: "top" | "bot";
  idx: number;
}

export interface Data {
  players: Players;
  games: {
    totalGames: 0;
    wins: {
      top: number;
      bot: number;
      draw: number;
    };
    totalMoves: number;
  };
  mostRecentMoves: MoveObject[];
}
const updatePlayers = (players: Players, currentPlayer: string) => {
  if (players[currentPlayer] === undefined) players[currentPlayer] = 1;
  else ++players[currentPlayer];
  return players;
};

const updateMostRecent = (moveArray: MoveObject[], moveObj: MoveObject) => {
  moveArray.unshift(moveObj);
  return moveArray.slice(0, 3);
};

const updateAfterTurn = (
  data: Data,
  currentPlayer: string,
  side: "top" | "bot",
  idx: number
) => {
  data.players = updatePlayers(data.players, currentPlayer);
  ++data.games.totalMoves;
  const move = { name: currentPlayer, side, idx };
  data.mostRecentMoves = updateMostRecent(data.mostRecentMoves, move);
  return data;
};

const updateAfterGame = (data: Data, winner: "top" | "bot" | "draw") => {
  ++data.games.totalGames;
  ++data.games.wins[winner];
  return data;
};

module.exports = {
  updatePlayers,
  updateAfterTurn,
  updateAfterGame,
  updateMostRecent,
};
