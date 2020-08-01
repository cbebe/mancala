const { makeMove, getOtherSide } = require("./move.js");

function equalBoards(b1, b2) {
  // i don't wanna compare arrays >:)
  if (b1.top.toString() !== b2.top.toString()) return false;
  if (b1.bot.toString() !== b2.bot.toString()) return false;

  if (b1.currentTurn !== b2.currentTurn) return false;
  if (b1.scores.top !== b2.scores.top) return false;
  if (b1.scores.bot !== b2.scores.bot) return false;

  return true;
}

test("Avalanche mechanic on own side", () => {
  const input = {
    currentTurn: "top",
    top: [1, 3, 1, 1, 1, 0, 1],
    bot: [1, 0, 1, 1, 1, 1, 1],
    scores: { top: 0, bot: 0 },
  };

  const expected = {
    currentTurn: "bot",
    top: [0, 0, 2, 2, 2, 1, 1],
    bot: [1, 0, 1, 1, 1, 1, 1],
    scores: { top: 0, bot: 0 },
  };
  const output = makeMove(input, "top", 0);
  console.log({ output, expected });
  expect(equalBoards(output, expected)).toBe(true);
});

test("Avalance mechanic on both sides", () => {
  const input = {
    currentTurn: "top",
    top: [0, 0, 0, 5, 0, 0, 0],
    bot: [6, 0, 0, 0, 0, 0, 0],
    scores: { top: 0, bot: 0 },
  };

  const expected = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 1, 1, 1],
    bot: [0, 1, 1, 1, 1, 1, 0],
    scores: { top: 3, bot: 0 },
  };
  const output = makeMove(input, "top", 3);
  console.log({ output, expected });
  expect(equalBoards(output, expected)).toBe(true);
});

test("Capture mechanic", () => {
  const input = {
    currentTurn: "top",
    top: [0, 0, 0, 0, 0, 0, 9],
    bot: [0, 0, 0, 0, 0, 0, 10],
    scores: { top: 0, bot: 0 },
  };

  const expected = {
    currentTurn: "bot",
    top: [0, 0, 0, 0, 0, 0, 0],
    bot: [1, 1, 1, 1, 1, 1, 0],
    scores: { top: 13, bot: 0 },
  };

  const output = makeMove(input, "top", 6);
  console.log({ output, expected });
  expect(equalBoards(output, expected)).toBe(true);
});
