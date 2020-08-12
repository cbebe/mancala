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
export function updateAfterTurn(data, move) {
    let newData = Object.assign({}, data);
    newData.players = updatePlayers(newData.players, move.name);
    ++newData.totalMoves;
    newData.mostRecentMoves = updateMostRecentMoves(newData.mostRecentMoves, move);
    return newData;
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
