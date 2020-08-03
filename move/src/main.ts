import core from "@actions/core";
import jsonfile from "jsonfile";
import fs from "fs";

import { Board, Data, Side } from "./interfaces";
import { makeMove, newGame } from "./move.js";
import { createReadme } from "./write.js";
import { updateAfterTurn, updateAfterGame } from "./update.js";

const boardFile = "./board.json";
const dataFile = "./data.json";

function getArgs(title: string) {
  const args = title.split("|");
  return args.slice(1);
}

function writeToFiles(board: Board, data: Data) {
  jsonfile.writeFile(boardFile, board, { spaces: 2 }, (err: Error) => {
    if (err) console.error(err);
  });
  jsonfile.writeFile(dataFile, data, { spaces: 2 }, (err: Error) => {
    if (err) console.error(err);
  });
  fs.writeFileSync("./README.md", createReadme(board, data));
}

// Main script

jsonfile.readFile(boardFile, (err: Error, obj: Board) => {
  if (err) console.error(err);

  const title = core.getInput("title") || "sungka|new";
  const username = core.getInput("user") || "cbebe";
  const args = getArgs(title);

  const restartGame = args[0] === "new";
  const board = restartGame
    ? newGame(obj)
    : makeMove(obj, <Side>args[0], Number(args[1]));
  jsonfile.readFile(dataFile, (err: Error, obj: Data) => {
    let data = { ...obj };
    if (err) console.error(err);

    if (!restartGame) {
      data = updateAfterTurn(data, username, <Side>args[0], Number(args[1]));
      if (board.gameOver) data = updateAfterGame(data, board.currentTurn);
    }
    writeToFiles(board, data);
  });
});
