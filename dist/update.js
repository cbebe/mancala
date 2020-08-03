export const updatePlayers = (players, currentPlayer) => {
    if (!players[currentPlayer])
        players[currentPlayer] = 1;
    else
        ++players[currentPlayer];
    return players;
};
export const updateMostRecent = (moveArray, moveObj) => {
    moveArray.unshift(moveObj);
    return moveArray.slice(0, 3);
};
export const updateAfterTurn = (data, currentPlayer, side, idx) => {
    data.players = updatePlayers(data.players, currentPlayer);
    ++data.games.totalMoves;
    const move = { name: currentPlayer, side, idx };
    data.mostRecentMoves = updateMostRecent(data.mostRecentMoves, move);
    return data;
};
export const updateAfterGame = (data, winner) => {
    ++data.games.totalGames;
    ++data.games.wins[winner];
    return data;
};
