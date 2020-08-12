import {
  updatePlayers,
  updateAfterGame,
  updateAfterTurn,
  updateMostRecentMoves,
} from "../src/update";

import { Data, MoveObject, Board } from "../src/interfaces";
import { emptyData } from "./board";

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
  const input: Data = emptyData();
  const expected: Data = {
    players: {},
    totalGames: 1,
    wins: {
      top: 1,
      bot: 0,
      draw: 0,
    },
    totalMoves: 1,
    mostRecentMoves: [],
    mostRecentGames: [{ scores: { top: 1, bot: 0 }, turnsPlayed: 1 }],
  };
  const testBoard: Board = {
    top: [0, 0, 0, 0, 0, 0, 0],
    bot: [0, 0, 0, 0, 0, 0, 0],
    scores: {
      top: 1,
      bot: 0,
    },
    currentTurn: "top",
    gameOver: true,
    turnsPlayed: 1,
  };
  const output = updateAfterGame(input, testBoard);
  expect(output.toString()).toBe(expected.toString());
});

test("Updating data after turn", () => {
  const input: Data = emptyData();
  const user: MoveObject = { name: "cbebe", side: "top", idx: 0 };
  const expected: Data = {
    players: { cbebe: 1 },
    totalGames: 0,
    wins: {
      top: 0,
      bot: 0,
      draw: 0,
    },
    totalMoves: 1,
    mostRecentMoves: [user],
    mostRecentGames: [],
  };
  const output: Data = updateAfterTurn(input, user);
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
  const output = updateMostRecentMoves(input, {
    name: "cbebe4",
    side: "bot",
    idx: 3,
  });
  expect(output.toString()).toBe(expected.toString());
});
