export const updatePlayers = (players, currentPlayer) => {
    if (!players[currentPlayer])
        players[currentPlayer] = 1;
    else
        ++players[currentPlayer];
    return players;
};
export const updateMostRecentMoves = (moveArray, moveObj) => {
    moveArray.unshift(moveObj);
    return moveArray.slice(0, 3);
};
export const updateAfterTurn = (data, currentPlayer, side, idx) => {
    data.players = updatePlayers(data.players, currentPlayer);
    ++data.games.totalMoves;
    const move = { name: currentPlayer, side, idx };
    data.mostRecentMoves = updateMostRecentMoves(data.mostRecentMoves, move);
    return data;
};
export const updateMostRecentGames = (mostRecentGames, board) => {
    const gameRecord = {
        scores: {
            top: board.scores.top,
            bot: board.scores.bot,
        },
        turnsPlayed: board.turnsPlayed,
    };
    mostRecentGames.push(gameRecord);
    return mostRecentGames;
};
export const updateAfterGame = (data, board) => {
    const winner = board.currentTurn;
    ++data.games.totalGames;
    ++data.games.wins[winner];
    data.mostRecentGames = updateMostRecentGames(data.mostRecentGames, board);
    return data;
};
