const {
  updatePlayers,
  updateAfterGame,
  updateAfterTurn,
  updateMostRecent,
} = require("./update.js");

test("Check if function creates players", () => {
  const input = {};
  const output = updatePlayers(input, "cbebe");
  expect(output.toString()).toBe({ cbebe: 1 }.toString());
});

test("Check if function updates player move count", () => {
  const input = { cbebe: 1 };
  const output = updatePlayers(input, "cbebe").toString();
  expect(output).toBe({ cbebe: 2 }.toString());
});

test("Updating data after game", () => {
  const input = {
    players: {},
    games: {
      totalGames: 0,
      wins: {
        top: 0,
        bot: 0,
        draw: 0,
      },
    },
    totalMoves: 0,
    mostRecentMoves: [],
  };
  const expected = {
    players: {},
    games: {
      totalGames: 1,
      wins: {
        top: 1,
        bot: 0,
        draw: 0,
      },
    },
    totalMoves: 0,
    mostRecentMoves: [],
  }.toString();
  const output = updateAfterGame(input, "top").toString();
  expect(output).toBe(expected);
});

test("Updating data after turn", () => {
  const input = {
    players: {},
    games: {
      totalGames: 0,
      wins: {
        top: 0,
        bot: 0,
        draw: 0,
      },
    },
    totalMoves: 0,
    mostRecentMoves: [],
  };
  const expected = {
    players: { cbebe: 1 },
    games: {
      totalGames: 0,
      wins: {
        top: 0,
        bot: 0,
        draw: 0,
      },
    },
    totalMoves: 0,
    mostRecentMoves: [{ name: "cbebe", side: "top", idx: 0 }],
  }.toString();
  const output = updateAfterTurn(input, "cbebe", "top", 0).toString();
  expect(output).toBe(expected);
});

test("Clips most recent players array", () => {
  const input = [
    { name: "cbebe3", side: "top", idx: 2 },
    { name: "cbebe2", side: "bot", idx: 1 },
    { name: "cbebe1", side: "top", idx: 0 },
  ];
  const expected = [
    { name: "cbebe4", side: "bot", idx: 3 },
    { name: "cbebe3", side: "top", idx: 2 },
    { name: "cbebe2", side: "bot", idx: 1 },
  ].toString();
  const output = updateMostRecent(input, {
    name: "cbebe4",
    side: "bot",
    idx: 3,
  }).toString();
  expect(output).toBe(expected);
});
