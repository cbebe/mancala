import { Board, Side, Data } from "../src/interfaces";
// Helper Functions for testing

function compareNumArrays(arr1: number[], arr2: number[]) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((num, idx) => num === arr2[idx]);
}

export const equalBoards = (b1: Board, b2: Board) =>
  !(
    !compareNumArrays(b1.top, b2.top) ||
    !compareNumArrays(b1.bot, b2.bot) ||
    b1.currentTurn !== b2.currentTurn ||
    b1.scores.top !== b2.scores.top ||
    b1.scores.bot !== b2.scores.bot ||
    b1.gameOver !== b2.gameOver ||
    b1.turnsPlayed !== b2.turnsPlayed
  );

export const board = (
  top: number[],
  bot: number[],
  currentTurn: Side | "draw",
  scores: [number, number] = [0, 0],
  turnsPlayed = 0,
  gameOver = false
): Board => {
  return {
    currentTurn,
    top,
    bot,
    scores: { top: scores[0], bot: scores[1] },
    gameOver,
    turnsPlayed,
  };
};

export const newArr = () => [7, 7, 7, 7, 7, 7, 7];
export const empty = () => [0, 0, 0, 0, 0, 0, 0];

// when there's only one pit with shells on the row
export const onePit = (i: number, shells = 1) => {
  const arr = empty();
  arr[i] = shells;
  return arr;
};

const zeroGames = () => ({
  totalGames: 0,
  wins: {
    top: 0,
    bot: 0,
    draw: 0,
  },
  totalMoves: 0,
});

export const emptyData = (): Data => ({
  players: {},
  ...zeroGames(),
  mostRecentMoves: [],
  mostRecentGames: [],
});
