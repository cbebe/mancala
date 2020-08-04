import { MoveObject, Players, Data, Side } from "./interfaces";

export const updatePlayers = (players: Players, currentPlayer: string) => {
  if (!players[currentPlayer]) players[currentPlayer] = 1;
  else ++players[currentPlayer];
  return players;
};

export const updateMostRecent = (
  moveArray: MoveObject[],
  moveObj: MoveObject
) => {
  moveArray.unshift(moveObj);
  return moveArray.slice(0, 3);
};

export const updateAfterTurn = (
  data: Data,
  currentPlayer: string,
  side: Side,
  idx: number
) => {
  data.players = updatePlayers(data.players, currentPlayer);
  ++data.games.totalMoves;
  const move = { name: currentPlayer, side, idx };
  data.mostRecentMoves = updateMostRecent(data.mostRecentMoves, move);
  return data;
};

export const updateAfterGame = (data: Data, winner: Side | "draw") => {
  ++data.games.totalGames;
  ++data.games.wins[winner];
  return data;
};
