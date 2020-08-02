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
}

export interface MoveObject {
  name: string;
  side: "top" | "bot";
  idx: number;
}

export interface Players {
  [key: string]: number;
}

export interface Data {
  players: Players;
  games: {
    totalGames: number;
    wins: {
      top: number;
      bot: number;
      draw: number;
    };
    totalMoves: number;
  };
  mostRecentMoves: MoveObject[];
}
