package main

import (
	"math/rand"
)

func getOtherSide(s Side) Side {
	if s == Top {
		return Bot
	} else {
		return Top
	}
}

func hasMoves(b Board, side Side) bool {
	if side == Top {
		for _, hole := range b.top {
			if hole > 0 {
				return true
			}
		}
	} else if side == Bot {
		for _, hole := range b.bot {
			if hole > 0 {
				return true
			}
		}

	}

	return false
}

func newBoard() Board {
	return Board{
		currentTurn: Top,
		top:         []int{7, 7, 7, 7, 7, 7, 7},
		bot:         []int{7, 7, 7, 7, 7, 7, 7},
		scores: Scores{
			top: 0,
			bot: 0,
		},
		gameOver:    false,
		turnsPlayed: 0,
	}
}

func newGame(board Board) Board {
	if board.gameOver {
		return newBoard()
	} else {
		return board
	}
}

func getWinner(s Scores) Side {
	if s.top > s.bot {
		return Top
	} else if s.bot > s.top {
		return Bot
	} else {
		return Draw
	}
}

type BoardMove struct {
	board Board
	side  Side
}

func newBoardMove(b Board, s Side) BoardMove {
	return BoardMove{b, s}
}

func (b *BoardMove) makeMove(holeIdx int) Board {
	outOfRange := holeIdx < 0 || holeIdx > 6
	invalidTurn := b.side != b.board.currentTurn
	shells := (*b.getSidePits(b.side))[holeIdx]
	if shells == 0 || outOfRange || invalidTurn || b.board.gameOver {
		return b.board
	}

	(*b.getSidePits(b.side))[holeIdx] = 0
	startingIdx := holeIdx + 1
	currentSide := b.side
	extraMove := false

	for shells > 0 {
		shells = b.distributeStones(startingIdx, shells, currentSide)
		if shells > 0 && currentSide == b.side {
			if b.side == Top {
				b.board.scores.top++
			} else if b.side == Bot {
				b.board.scores.bot++
			}
			shells--
			extraMove = shells == 0
		}
		currentSide = getOtherSide(currentSide)
		startingIdx = 0
	}
	return b.evaluateAfterMove(extraMove)
}

func getSidePits(b *Board, s Side) *[]int {
	if s == Top {
		return &b.top
	} else if s == Bot {
		return &b.bot
	}
	return nil
}

func (b *BoardMove) getSidePits(s Side) *[]int {
	return getSidePits(&b.board, s)
}

func getSideScore(b *Board, s Side) *int {
	if s == Top {
		return &b.scores.top
	} else if s == Bot {
		return &b.scores.bot
	}
	return nil
}

func (b *BoardMove) getSideScore(s Side) *int {
	return getSideScore(&b.board, s)
}

func (b *BoardMove) distributeStones(startingIdx, shells int, currentSide Side) int {
	otherSide := getOtherSide(b.side)
	shellCount := shells
	for i := startingIdx; shellCount > 0 && i < 7; i++ {
		// last shell mechanics
		lastShell := shellCount == 1
		nextPitEmpty := (*b.getSidePits(currentSide))[i] == 0
		otherPitEmpty := (*b.getSidePits(otherSide))[6-i] == 0
		canCapture := nextPitEmpty && !otherPitEmpty && currentSide == b.side

		if lastShell && !nextPitEmpty {
			(*b.getSidePits(currentSide))[i]++
			shellCount = (*b.getSidePits(currentSide))[i]
			(*b.getSidePits(currentSide))[i] = 0
		} else if lastShell && canCapture {
			(*b.getSidePits(otherSide))[6-i]++
			*b.getSideScore(b.side) += (*b.getSidePits(otherSide))[6-i]
			shellCount--
		} else {
			shellCount--
			(*b.getSidePits(currentSide))[i]++
		}
	}
	return shellCount
}

func (b *BoardMove) evaluateAfterMove(extraMove bool) Board {
	otherSide := getOtherSide(b.side)
	playerHasMoves := hasMoves(b.board, b.side)
	enemyHasMoves := hasMoves(b.board, otherSide)
	moveAgain := (extraMove && playerHasMoves) || !enemyHasMoves
	if moveAgain {
		b.board.currentTurn = b.side
	} else {
		b.board.currentTurn = otherSide
	}

	if !moveAgain {
		b.board.turnsPlayed++
	}

	if !(playerHasMoves || enemyHasMoves) {
		b.board.gameOver = true
		b.board.currentTurn = getWinner(b.board.scores)
		b.board.turnsPlayed++
	}

	return b.board
}

// AI Stuff
func randomMove(moves []int) int {
	return moves[rand.Intn(len(moves))]
}

func getPossibleMoves(row []int) []int {
	moves := []int{}
	for i := len(row) - 1; i >= 0; i-- {
		if row[i] > 0 {
			moves = append(moves, i)
		}
	}
	return moves
}

func chooseMove(b BoardMove) int {
	thisRow := *b.getSidePits(b.side)
	/*
		TO-DO: try to enforce capturing first before trying to make a random move
		otherSide := getOtherSide(b.side)
		otherRow := *b.getSidePits(otherSide)
	*/
	possibleMoves := getPossibleMoves(thisRow)
	for _, i := range possibleMoves {
		if thisRow[i]+i == 7 {
			return i
		}
	}
	return randomMove(possibleMoves)
}

func makeAIMove(board Board) Board {
	if board.gameOver {
		return board
	}
	currentSide := board.currentTurn
	b := newBoardMove(board, currentSide)
	isTurn := b.board.currentTurn == currentSide
	for isTurn && !b.board.gameOver {
		holeIdx := chooseMove(b)
		b.makeMove(holeIdx)
		isTurn = b.board.currentTurn == currentSide
	}

	return b.board
}
