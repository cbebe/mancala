import { Side, Board } from "./interfaces";
import { BoardMove, equalBoards } from "./move";

function chooseMove(move: BoardMove) {
  const possibleMoves: number[] = [];
  move.board[move.side].forEach((num, i) => {
    if (num) possibleMoves.push(i);
  });

  return 6;
}

export function makeAIMove(board: Board) {
  if (board.gameOver) return board;
  // currentSide will never be draw
  const currentSide = <Side>board.currentTurn;
  const boardMove = new BoardMove(board, currentSide);

  let isTurn = boardMove.board.currentTurn === currentSide;
  while (isTurn) {
    const holeIdx = chooseMove(boardMove);
    boardMove.makeMove(holeIdx);
    isTurn = boardMove.board.currentTurn === currentSide;
  }

  return boardMove.board;
}
