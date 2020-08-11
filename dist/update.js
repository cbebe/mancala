export function updatePlayers(players, currentPlayer) {
    if (!players[currentPlayer])
        players[currentPlayer] = 1;
    else
        ++players[currentPlayer];
    return players;
}
export function updateMostRecentMoves(moveArray, moveObj) {
    moveArray.unshift(moveObj);
    return moveArray.slice(0, 3);
}
export function updateAfterTurn(data, currentPlayer, side, idx) {
    data.players = updatePlayers(data.players, currentPlayer);
    ++data.totalMoves;
    const move = { name: currentPlayer, side, idx };
    data.mostRecentMoves = updateMostRecentMoves(data.mostRecentMoves, move);
    return data;
}
export function updateMostRecentGames(mostRecentGames, board) {
    const gameRecord = {
        scores: {
            top: board.scores.top,
            bot: board.scores.bot,
        },
        turnsPlayed: board.turnsPlayed,
    };
    mostRecentGames.unshift(gameRecord);
    return mostRecentGames;
}
export function updateAfterGame(data, board) {
    const winner = board.currentTurn;
    ++data.totalGames;
    ++data.wins[winner];
    data.mostRecentGames = updateMostRecentGames(data.mostRecentGames, board);
    return data;
}
