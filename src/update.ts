import {
  MoveObject,
  Players,
  Data,
  Side,
  Board,
  GameRecord,
} from "./interfaces";

export function updatePlayers(players: Players, currentPlayer: string) {
  if (!players[currentPlayer]) players[currentPlayer] = 1;
  else ++players[currentPlayer];
  return players;
}

export function updateMostRecentMoves(
  moveArray: MoveObject[],
  moveObj: MoveObject
) {
  moveArray.unshift(moveObj);
  return moveArray.slice(0, 3);
}

export function updateAfterTurn(
  data: Data,
  currentPlayer: string,
  side: Side,
  idx: number
) {
  data.players = updatePlayers(data.players, currentPlayer);
  ++data.totalMoves;
  const move = { name: currentPlayer, side, idx };
  data.mostRecentMoves = updateMostRecentMoves(data.mostRecentMoves, move);
  return data;
}

export function updateMostRecentGames(
  mostRecentGames: GameRecord[],
  board: Board
) {
  const gameRecord: GameRecord = {
    scores: {
      top: board.scores.top,
      bot: board.scores.bot,
    },
    turnsPlayed: board.turnsPlayed,
  };

  mostRecentGames.unshift(gameRecord);
  return mostRecentGames;
}

export function updateAfterGame(data: Data, board: Board) {
  const winner = board.currentTurn;
  ++data.totalGames;
  ++data.wins[winner];
  data.mostRecentGames = updateMostRecentGames(data.mostRecentGames, board);
  return data;
}
