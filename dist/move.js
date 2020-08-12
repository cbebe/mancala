export const getOtherSide = (side) => (side === "top" ? "bot" : "top");
const hasMoves = (board, side) => board[side].some(hole => hole > 0);
const newBoard = {
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
export const newGame = (board) => (board.gameOver ? newBoard : board);
const getWinner = ({ top, bot }) => top > bot ? "top" : bot > top ? "bot" : "draw";
export class BoardMove {
    constructor(board, side) {
        this.board = board;
        this.side = side;
    }
    makeMove(holeIdx) {
        const outOfRange = holeIdx < 0 || holeIdx > 6;
        const invalidTurn = this.side !== this.board.currentTurn;
        let shells = this.board[this.side][holeIdx];
        if (!shells || outOfRange || invalidTurn || this.board.gameOver)
            return this.board;
        this.board[this.side][holeIdx] = 0;
        let startingIdx = holeIdx + 1;
        let currentSide = this.side;
        let extraMove = false;
        while (shells > 0) {
            shells = this.distributeStones(startingIdx, shells, currentSide);
            if (shells && currentSide === this.side) {
                ++this.board.scores[this.side];
                --shells;
                if (shells === 0)
                    extraMove = true;
            }
            currentSide = getOtherSide(currentSide);
            startingIdx = 0;
        }
        return this.evaluateAfterMove(extraMove);
    }
    distributeStones(startingIdx, shells, currentSide) {
        const otherSide = getOtherSide(this.side);
        let shellCount = shells;
        for (let i = startingIdx; shellCount && i < 7; ++i) {
            const lastShell = shellCount === 1;
            const nextPitEmpty = !this.board[currentSide][i];
            const otherPitEmpty = !this.board[otherSide][6 - i];
            const canCapture = nextPitEmpty && !otherPitEmpty && currentSide === this.side;
            if (lastShell && !nextPitEmpty) {
                shellCount = ++this.board[currentSide][i];
                this.board[currentSide][i] = 0;
            }
            else if (lastShell && canCapture) {
                this.board.scores[this.side] += ++this.board[otherSide][6 - i];
                this.board[otherSide][6 - i] = 0;
                --shellCount;
            }
            else {
                --shellCount;
                ++this.board[currentSide][i];
            }
        }
        return shellCount;
    }
    evaluateAfterMove(extraMove) {
        const otherSide = getOtherSide(this.side);
        const playerHasMoves = hasMoves(this.board, this.side);
        const enemyHasMoves = hasMoves(this.board, otherSide);
        const moveAgain = (extraMove && playerHasMoves) || !enemyHasMoves;
        this.board.currentTurn = moveAgain ? this.side : otherSide;
        if (!moveAgain)
            ++this.board.turnsPlayed;
        if (!(playerHasMoves || enemyHasMoves)) {
            this.board.gameOver = true;
            this.board.currentTurn = getWinner(this.board.scores);
            ++this.board.turnsPlayed;
        }
        return this.board;
    }
}
const getRandomIdx = (arr) => Math.floor(Math.random() * arr.length);
const randomMove = (moves) => moves[getRandomIdx(moves)];
function getPossibleMoves(row) {
    const moves = [];
    const wor = row.reverse();
    wor.forEach((num, i) => {
        if (num)
            moves.push(i);
    });
    return moves;
}
function chooseMove({ board, side }) {
    const thisRow = board[side];
    const possibleMoves = getPossibleMoves(thisRow);
    for (let idx of possibleMoves)
        if (thisRow[idx] + idx === 7)
            return idx;
    return randomMove(possibleMoves);
}
export function makeAIMove(board) {
    if (board.gameOver)
        return board;
    const currentSide = board.currentTurn;
    const boardMove = new BoardMove(board, currentSide);
    let counter = 0;
    let isTurn = boardMove.board.currentTurn === currentSide;
    while (isTurn && !boardMove.board.gameOver) {
        const holeIdx = chooseMove(boardMove);
        boardMove.makeMove(holeIdx);
        console.log({ counter, board: boardMove.board });
        isTurn = boardMove.board.currentTurn === currentSide;
        counter++;
    }
    return boardMove.board;
}
