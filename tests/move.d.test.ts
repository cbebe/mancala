import { BoardMove, equalBoards, newGame } from "../src/move";
import { Board, Side } from "../src/interfaces";

const board = (
  top: number[],
  bot: number[],
  currentTurn: Side | "draw",
  scores: [number, number] = [0, 0],
  turnsPlayed = 0,
  gameOver = false
): Board => {
  return {
    currentTurn,
    top,
    bot,
    scores: { top: scores[0], bot: scores[1] },
    gameOver,
    turnsPlayed,
  };
};

const newArr = () => [7, 7, 7, 7, 7, 7, 7];
const empty = () => [0, 0, 0, 0, 0, 0, 0];

// when there's only one pit with shells on the row
const onePit = (i: number, shells = 1) => {
  const arr = empty();
  arr[i] = shells;
  return arr;
};

test("Avalanche mechanic on own side", () => {
  const bot = [1, 0, 1, 1, 1, 1, 1];
  const i = board([1, 3, 1, 1, 1, 0, 1], bot, "top");
  const e = board([0, 0, 2, 2, 2, 1, 1], bot, "bot", [0, 0], 1);
  const b = new BoardMove(i, "top");
  const o = b.makeMove(0);
  expect(equalBoards(o, e)).toBe(true);
});

test("Avalance mechanic on both sides", () => {
  const i = board(onePit(3, 5), onePit(0, 6), "top");
  const top = [0, 0, 0, 0, 1, 1, 1];
  const bot = [0, 1, 1, 1, 1, 1, 0];
  const e = board(top, bot, "bot", [3, 0], 1);
  const b = new BoardMove(i, "top");
  const o = b.makeMove(3);
  expect(equalBoards(o, e)).toBe(true);
});

test("Capture mechanic", () => {
  const i = board(onePit(6, 9), onePit(6, 10), "top");
  const e = board(empty(), [1, 1, 1, 1, 1, 1, 0], "bot", [13, 0], 1);
  const b = new BoardMove(i, "top");
  const o = b.makeMove(6);
  expect(equalBoards(o, e)).toBe(true);
});

test("Extra move", () => {
  const i = board(newArr(), newArr(), "top");
  const e = board([0, 8, 8, 8, 8, 8, 8], newArr(), "top", [1, 0]);
  const b = new BoardMove(i, "top");
  const o = b.makeMove(0);
  expect(equalBoards(o, e)).toBe(true);
});

test("No moves even when the current player has extra move", () => {
  const i = board(onePit(6), newArr(), "top");
  const e = board(empty(), newArr(), "bot", [1, 0], 1);
  const b = new BoardMove(i, "top");
  const o = b.makeMove(6);
  expect(equalBoards(o, e)).toBe(true);
});

test("No moves for the other player", () => {
  const i = board(empty(), onePit(5), "bot");
  const e = board(empty(), onePit(6), "bot");
  const b = new BoardMove(i, "bot");
  const o = b.makeMove(5);
  expect(equalBoards(o, e)).toBe(true);
});

test("Game over", () => {
  const i = board(empty(), onePit(6), "bot");
  const e = board(empty(), empty(), "bot", [0, 1], 1, true);
  const b = new BoardMove(i, "bot");
  const o = b.makeMove(6);
  expect(equalBoards(o, e)).toBe(true);
});

test("Creates new game", () => {
  const i = board(empty(), empty(), "draw", [49, 49], 1, true);
  const e = board(newArr(), newArr(), "top");
  const o = newGame(i);
  expect(equalBoards(o, e)).toBe(true);
});

test("Cancel attempt to create new game", () => {
  const i = board(newArr(), newArr(), "bot");
  const e = i;
  const o = newGame(i);
  expect(equalBoards(o, e)).toBe(true);
});

test("Getting a draw", () => {
  const i = board(empty(), onePit(6), "bot", [1, 0]);
  const e = board(empty(), empty(), "draw", [1, 1], 1, true);
  const b = new BoardMove(i, "bot");
  const o = b.makeMove(6);
  expect(equalBoards(o, e)).toBe(true);
});

test("Increment turns played", () => {
  const i = board(onePit(1), onePit(1), "top");
  const e = board(onePit(2), onePit(1), "bot", [0, 0], 1);
  const b = new BoardMove(i, "top");
  const o = b.makeMove(1);
  expect(equalBoards(o, e)).toBe(true);
});
