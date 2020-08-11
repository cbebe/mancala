import { BoardMove } from "./move";
function chooseMove(move) {
    const possibleMoves = [];
    move.board[move.side].forEach((num, i) => {
        if (num)
            possibleMoves.push(i);
    });
    return 6;
}
export function makeAIMove(board) {
    if (board.gameOver)
        return board;
    // currentSide will never be draw
    const currentSide = board.currentTurn;
    const boardMove = new BoardMove(board, currentSide);
    let isTurn = boardMove.board.currentTurn === currentSide;
    while (isTurn) {
        const holeIdx = chooseMove(boardMove);
        boardMove.makeMove(holeIdx);
        isTurn = boardMove.board.currentTurn === currentSide;
    }
    return boardMove.board;
}
