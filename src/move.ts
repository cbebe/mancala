import { Board, Scores, Side } from "./interfaces";

export function equalBoards(b1: Board, b2: Board) {
  // i don't wanna compare arrays >:)
  if (b1.top.toString() !== b2.top.toString()) return false;
  if (b1.bot.toString() !== b2.bot.toString()) return false;

  if (b1.currentTurn !== b2.currentTurn) return false;
  if (b1.scores.top !== b2.scores.top) return false;
  if (b1.scores.bot !== b2.scores.bot) return false;

  if (b1.gameOver !== b2.gameOver) return false;

  return true;
}

function getOtherSide(currentSide: Side) {
  return currentSide === "top" ? "bot" : "top";
}

function hasMoves(board: Board, side: Side) {
  return board[side].some(hole => hole > 0);
}

const newBoard: Board = {
  currentTurn: "top",
  top: [7, 7, 7, 7, 7, 7, 7],
  bot: [7, 7, 7, 7, 7, 7, 7],
  scores: {
    top: 0,
    bot: 0,
  },
  gameOver: false,
};

export function newGame(board: Board): Board {
  return board.gameOver ? newBoard : board;
}

const getWinner = ({ top, bot }: Scores) =>
  top > bot ? "top" : bot > top ? "bot" : "draw";

export function makeMove(board: Board, side: Side, holeIdx: number) {
  const newBoard = { ...board };
  let stones = newBoard[side][holeIdx];

  if (
    !stones ||
    holeIdx < 0 ||
    holeIdx > 6 ||
    side !== newBoard.currentTurn ||
    newBoard.gameOver
  )
    return newBoard;

  const otherSide = getOtherSide(side);
  newBoard[side][holeIdx] = 0;
  let startingIdx = holeIdx + 1;
  let currentSide = side;
  let extraMove = false;
  while (stones > 0) {
    for (let i = startingIdx; stones && i < 7; ++i) {
      // last stone mechanics
      const lastStone = stones === 1;
      const nextPitEmpty = !newBoard[currentSide][i];
      const otherPitEmpty = !newBoard[otherSide][6 - i];
      const canCapture = nextPitEmpty && !otherPitEmpty && currentSide === side;

      if (lastStone && !nextPitEmpty) {
        stones = ++newBoard[currentSide][i];
        newBoard[currentSide][i] = 0;
      } else if (lastStone && canCapture) {
        newBoard.scores[side] += ++newBoard[otherSide][6 - i];
        newBoard[otherSide][6 - i] = 0;
        --stones;
      } else {
        --stones;
        ++newBoard[currentSide][i];
      }
    }

    if (stones && currentSide === side) {
      ++newBoard.scores[side];
      stones--;
      if (stones === 0) {
        extraMove = true;
      }
    }
    currentSide = getOtherSide(currentSide);
    startingIdx = 0;
  }

  const playerHasMoves = hasMoves(board, side);
  const enemyHasMoves = hasMoves(board, otherSide);

  const moveAgain = (extraMove && playerHasMoves) || !enemyHasMoves;
  newBoard.currentTurn = moveAgain ? side : otherSide;

  if (!(playerHasMoves || enemyHasMoves)) {
    newBoard.gameOver = true;
    newBoard.currentTurn = getWinner(newBoard.scores);
  }

  return newBoard;
}
