import {
  updatePlayers,
  updateAfterGame,
  updateAfterTurn,
  updateMostRecent,
} from "../src/update";
import { Data, MoveObject } from "../src/interfaces";

const zeroGames = {
  totalGames: 0,
  wins: {
    top: 0,
    bot: 0,
    draw: 0,
  },
  totalMoves: 0,
};

test("Check if function creates players", () => {
  const input = { boi: 1 };
  const output = updatePlayers(input, "cbebe");
  expect(output.toString()).toBe({ boi: 1, cbebe: 1 }.toString());
});

test("Check if function updates player move count", () => {
  const input = { cbebe: 1 };
  const output = updatePlayers(input, "cbebe").toString();
  expect(output).toBe({ cbebe: 2 }.toString());
});

test("Updating data after game", () => {
  const input: Data = {
    players: {},
    games: zeroGames,
    mostRecentMoves: [],
  };
  const expected: Data = {
    players: {},
    games: {
      totalGames: 1,
      wins: {
        top: 1,
        bot: 0,
        draw: 0,
      },
      totalMoves: 1,
    },
    mostRecentMoves: [],
  };
  const output = updateAfterGame(input, "top");
  expect(output.toString()).toBe(expected.toString());
});

test("Updating data after turn", () => {
  const input: Data = {
    players: {},
    games: zeroGames,
    mostRecentMoves: [],
  };
  const expected: Data = {
    players: { cbebe: 1 },
    games: {
      totalGames: 0,
      wins: {
        top: 0,
        bot: 0,
        draw: 0,
      },
      totalMoves: 1,
    },
    mostRecentMoves: [{ name: "cbebe", side: "top", idx: 0 }],
  };
  const output: Data = updateAfterTurn(input, "cbebe", "top", 0);
  expect(output.toString()).toBe(expected.toString());
});

test("Clips most recent players array", () => {
  const input: MoveObject[] = [
    { name: "cbebe3", side: "top", idx: 2 },
    { name: "cbebe2", side: "bot", idx: 1 },
    { name: "cbebe1", side: "top", idx: 0 },
  ];
  const expected: MoveObject[] = [
    { name: "cbebe4", side: "bot", idx: 3 },
    { name: "cbebe3", side: "top", idx: 2 },
    { name: "cbebe2", side: "bot", idx: 1 },
  ];
  const output = updateMostRecent(input, {
    name: "cbebe4",
    side: "bot",
    idx: 3,
  });
  expect(output.toString()).toBe(expected.toString());
});