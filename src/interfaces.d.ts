export type Side = "top" | "bot";

export interface Scores {
  top: number;
  bot: number;
}

export interface Board {
  currentTurn: Side | "draw";
  top: number[];
  bot: number[];
  scores: Scores;
  gameOver: boolean;
  turnsPlayed: number;
}

export interface MoveObject {
  name: string;
  side: Side;
  idx: number;
}

export interface Players {
  [key: string]: number;
}

export interface GameRecord {
  scores: {
    top: number;
    bot: number;
  };
  turnsPlayed: number;
}

export interface Data {
  players: Players;
  totalGames: number;
  wins: {
    top: number;
    bot: number;
    draw: number;
  };
  totalMoves: number;
  mostRecentMoves: MoveObject[];
  mostRecentGames: GameRecord[];
}
