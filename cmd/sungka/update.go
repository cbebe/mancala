package main

func updatePlayers(players Players, currentPlayer string) Players {
	_, ok := players[currentPlayer]
	if !ok {
		players[currentPlayer] = 1
	} else {
		players[currentPlayer]++
	}
	return players
}

func updateMostRecentMoves(moveArray []MoveObject, moveObj MoveObject) []MoveObject {
	return append([]MoveObject{moveObj}, moveArray...)[0:3]
}

func updateAfterTurn(data Data, move MoveObject) Data {
	newData := data
	newData.players = updatePlayers(newData.players, move.name)
	newData.totalMoves++
	newData.mostRecentMoves = updateMostRecentMoves(newData.mostRecentMoves, move)
	return newData
}

func updateMostRecentGames(mostRecentGames []GameRecord, board Board) []GameRecord {
	gameRecord := GameRecord{
		scores: Scores{
			top: board.scores.top,
			bot: board.scores.bot,
		},
		turnsPlayed: board.turnsPlayed,
	}

	return append([]GameRecord{gameRecord}, mostRecentGames...)
}

func updateAfterGame(data Data, board Board) Data {
	winner := board.currentTurn
	data.totalGames++
	data.wins[winner]++
	data.mostRecentGames = updateMostRecentGames(data.mostRecentGames, board)
	return data
}
