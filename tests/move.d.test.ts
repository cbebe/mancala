import { BoardMove, newGame, makeAIMove } from "../src/move";
import { equalBoards, board, onePit, empty, newArr } from "./board";

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

// AI stuff

test("Make AI end game", () => {
  const i = board(onePit(5), empty(), "top");
  const o = makeAIMove(i);
  const e = board(empty(), empty(), "top", [1, 0], 1, true);
  expect(equalBoards(o, e)).toBe(true);
});

/*
test("Perfect combo", async () => {
  const i = board([7, 6, 5, 4, 3, 2, 1], onePit(6), "top");
  const o = makeAIMove(i);
  const e = board(empty(), onePit(6), "bot", [28, 0], 28);
  console.log({ o, e });
  expect(equalBoards(o, e)).toBe(true);
}, 3000);
*/
