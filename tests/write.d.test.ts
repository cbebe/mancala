import { createHTTPText, createRecentGames } from "../src/write";
import { GameRecord } from "../src/interfaces";

test("Replace spaces with plus", () => {
  const input = "Hello plus world";
  const output = createHTTPText(input, true);
  const expected = "Hello+plus+world";
  expect(output).toBe(expected);
});

test("Create table for recent games", () => {
  const input: GameRecord[] = [{ scores: { top: 1, bot: 0 }, turnsPlayed: 2 }];
  const output = createRecentGames(input);
  const expected = "|Top Score|Bottom Score|Turns Played|\n|-|-|-|\n|1|0|2|";
  expect(output).toBe(expected);
});

test("Replace spaces with %20, pipes with %7C, and single quotes with %27", () => {
  const input = "Hello |pipe| 'world'";
  const output = createHTTPText(input);
  const expected = "Hello%20%7Cpipe%7C%20%27world%27";
  expect(output).toBe(expected);
});
