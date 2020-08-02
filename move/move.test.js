const { makeMove, equalBoards } = require("./move.js");

test("Avalanche mechanic on own side", () => {
  const input = {
    currentTurn: "top",
    top: [1, 3, 1, 1, 1, 0, 1],
    bot: [1, 0, 1, 1, 1, 1, 1],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };

  const expected = {
    currentTurn: "bot",
    top: [0, 0, 2, 2, 2, 1, 1],
    bot: [1, 0, 1, 1, 1, 1, 1],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };
  const output = makeMove(input, "top", 0);
  expect(equalBoards(output, expected)).toBe(true);
});

test("Avalance mechanic on both sides", () => {
  const input = {
    currentTurn: "top",
    top: [0, 0, 0, 5, 0, 0, 0],
    bot: [6, 0, 0, 0, 0, 0, 0],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };

  const expected = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 1, 1, 1],
    bot: [0, 1, 1, 1, 1, 1, 0],
    scores: { top: 3, bot: 0 },
    gameOver: false,
  };
  const output = makeMove(input, "top", 3);
  expect(equalBoards(output, expected)).toBe(true);
});

test("Capture mechanic", () => {
  const input = {
    currentTurn: "top",
    top: [0, 0, 0, 0, 0, 0, 9],
    bot: [0, 0, 0, 0, 0, 0, 10],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };

  const expected = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 0, 0, 0],
    bot: [1, 1, 1, 1, 1, 1, 0],
    scores: { top: 13, bot: 0 },
    gameOver: false,
  };

  const output = makeMove(input, "top", 6);
  expect(equalBoards(output, expected)).toBe(true);
});

test("Extra move", () => {
  const input = {
    currentTurn: "top",
    top: [7, 7, 7, 7, 7, 7, 7],
    bot: [7, 7, 7, 7, 7, 7, 7],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };
  const expected = {
    currentTurn: "top",
    top: [0, 8, 8, 8, 8, 8, 8],
    bot: [7, 7, 7, 7, 7, 7, 7],
    scores: { top: 1, bot: 0 },
    gameOver: false,
  };

  const output = makeMove(input, "top", 0);
  expect(equalBoards(output, expected)).toBe(true);
});

test("No moves even when the current player has extra move", () => {
  const input = {
    currentTurn: "top",
    top: [0, 0, 0, 0, 0, 0, 1],
    bot: [7, 7, 7, 7, 7, 7, 7],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };
  const expected = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 0, 0, 0],
    bot: [7, 7, 7, 7, 7, 7, 7],
    scores: { top: 1, bot: 0 },
    gameOver: false,
  };
  const output = makeMove(input, "top", 6);
  expect(equalBoards(output, expected)).toBe(true);
});

test("No moves for the other player", () => {
  const input = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 0, 0, 0],
    bot: [0, 0, 0, 0, 0, 1, 0],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };
  const expected = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 0, 0, 0],
    bot: [0, 0, 0, 0, 0, 0, 1],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };
  const output = makeMove(input, "bot", 5);
  expect(equalBoards(output, expected)).toBe(true);
});

test("Game over", () => {
  const input = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 0, 0, 0],
    bot: [0, 0, 0, 0, 0, 0, 1],
    scores: { top: 0, bot: 0 },
    gameOver: false,
  };
  const expected = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 0, 0, 0],
    bot: [0, 0, 0, 0, 0, 0, 0],
    scores: { top: 0, bot: 1 },
    gameOver: true,
  };
  const output = makeMove(input, "bot", 6);
  expect(equalBoards(output, expected)).toBe(true);
});
