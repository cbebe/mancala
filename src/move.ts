import { Board, Scores, Side } from "./interfaces";

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

const getOtherSide = (currentSide: Side) =>
  currentSide === "top" ? "bot" : "top";

const hasMoves = (board: Board, side: Side) =>
  board[side].some(hole => hole > 0);

const newBoard: Board = {
  currentTurn: "top",
  top: [7, 7, 7, 7, 7, 7, 7],
  bot: [7, 7, 7, 7, 7, 7, 7],
  scores: {
    top: 0,
    bot: 0,
  },
  gameOver: false,
  turnsPlayed: 0,
};

export const newGame = (board: Board) => (board.gameOver ? newBoard : board);

const getWinner = ({ top, bot }: Scores) =>
  top > bot ? "top" : bot > top ? "bot" : "draw";

function evaluateAfterMove(board: Board, side: Side, extraMove: boolean) {
  const otherSide = getOtherSide(side);
  const playerHasMoves = hasMoves(board, side);
  const enemyHasMoves = hasMoves(board, otherSide);

  const moveAgain = (extraMove && playerHasMoves) || !enemyHasMoves;
  board.currentTurn = moveAgain ? side : otherSide;

  if (!moveAgain) ++board.turnsPlayed;

  if (!(playerHasMoves || enemyHasMoves)) {
    board.gameOver = true;
    board.currentTurn = getWinner(board.scores);
    ++board.turnsPlayed;
  }

  return board;
}

export function makeMove(board: Board, side: Side, holeIdx: number) {
  const outOfRange = holeIdx < 0 || holeIdx > 6;
  const invalidTurn = side !== board.currentTurn;

  let shells = board[side][holeIdx];
  if (!shells || outOfRange || invalidTurn || board.gameOver) return board;

  const newBoard = { ...board };
  const otherSide = getOtherSide(side);
  newBoard[side][holeIdx] = 0;
  let startingIdx = holeIdx + 1;
  let currentSide = side;
  let extraMove = false;
  while (shells > 0) {
    for (let i = startingIdx; shells && i < 7; ++i) {
      // last stone mechanics
      const lastStone = shells === 1;
      const nextPitEmpty = !newBoard[currentSide][i];
      const otherPitEmpty = !newBoard[otherSide][6 - i];
      const canCapture = nextPitEmpty && !otherPitEmpty && currentSide === side;

      if (lastStone && !nextPitEmpty) {
        shells = ++newBoard[currentSide][i];
        newBoard[currentSide][i] = 0;
      } else if (lastStone && canCapture) {
        newBoard.scores[side] += ++newBoard[otherSide][6 - i];
        newBoard[otherSide][6 - i] = 0;
        --shells;
      } else {
        --shells;
        ++newBoard[currentSide][i];
      }
    }

    if (shells && currentSide === side) {
      ++newBoard.scores[side];
      --shells;
      if (shells === 0) extraMove = true;
    }
    currentSide = getOtherSide(currentSide);
    startingIdx = 0;
  }

  return evaluateAfterMove(newBoard, side, extraMove);
}
