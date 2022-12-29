package main

type Side string

const (
	Top  Side = "top"
	Bot  Side = "bot"
	Draw Side = "draw"
)

type Scores struct {
	top int
	bot int
}

type Board struct {
	currentTurn Side
	top         []int
	bot         []int
	scores      Scores
	gameOver    bool
	turnsPlayed int
}

type MoveObject struct {
	name string
	side Side
	idx  int
}

type Players map[string]int

type GameRecord struct {
	scores      Scores
	turnsPlayed int
}

type Data struct {
	players         Players
	totalGames      int
	wins            map[Side]int
	totalMoves      int
	mostRecentMoves []MoveObject
	mostRecentGames []GameRecord
}

type Record struct {
	data  Data
	board Board
}
