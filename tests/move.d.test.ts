import { makeMove, equalBoards, newGame } from "../src/move";
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

// when there's only one piece on the row
const onePiece = (i: number) => {
  const arr = empty();
  arr[i] = 1;
  return arr;
};

test("Avalanche mechanic on own side", () => {
  const bot = [1, 0, 1, 1, 1, 1, 1];
  const i = board([1, 3, 1, 1, 1, 0, 1], bot, "top");
  const e = board([0, 0, 2, 2, 2, 1, 1], bot, "bot", [0, 0], 1);
  const o = makeMove(i, "top", 0);
  expect(equalBoards(o, e)).toBe(true);
});

test("Avalance mechanic on both sides", () => {
  const i = board([0, 0, 0, 5, 0, 0, 0], [6, 0, 0, 0, 0, 0, 0], "top");
  const e = board(
    [0, 0, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    "bot",
    [3, 0],
    1
  );
  const o = makeMove(i, "top", 3);
  expect(equalBoards(o, e)).toBe(true);
});

test("Capture mechanic", () => {
  const i = board([0, 0, 0, 0, 0, 0, 9], [0, 0, 0, 0, 0, 0, 10], "top");
  const e = board(empty(), [1, 1, 1, 1, 1, 1, 0], "bot", [13, 0], 1);
  const o = makeMove(i, "top", 6);
  expect(equalBoards(o, e)).toBe(true);
});

test("Extra move", () => {
  const i = board(newArr(), newArr(), "top");
  const e = board([0, 8, 8, 8, 8, 8, 8], newArr(), "top", [1, 0]);
  const o = makeMove(i, "top", 0);
  expect(equalBoards(o, e)).toBe(true);
});

test("No moves even when the current player has extra move", () => {
  const i = board(onePiece(6), newArr(), "top");
  const e = board(empty(), newArr(), "bot", [1, 0], 1);
  const o = makeMove(i, "top", 6);
  expect(equalBoards(o, e)).toBe(true);
});

test("No moves for the other player", () => {
  const i = board(empty(), onePiece(5), "bot");
  const e = board(empty(), onePiece(6), "bot");
  const o = makeMove(i, "bot", 5);
  expect(equalBoards(o, e)).toBe(true);
});

test("Game over", () => {
  const i = board(empty(), onePiece(6), "bot");
  const e = board(empty(), empty(), "bot", [0, 1], 1, true);
  const o = makeMove(i, "bot", 6);
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
  const i = board(empty(), onePiece(6), "bot", [1, 0]);
  const e = board(empty(), empty(), "draw", [1, 1], 1, true);
  const o = makeMove(i, "bot", 6);
  expect(equalBoards(o, e)).toBe(true);
});

test("Increment turns played", () => {
  const i = board(onePiece(1), onePiece(1), "top");
  const e = board(onePiece(2), onePiece(1), "bot", [0, 0], 1);
  const o = makeMove(i, "top", 1);
  expect(equalBoards(o, e)).toBe(true);
});
