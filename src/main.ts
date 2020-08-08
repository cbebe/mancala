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

function parseMove(board: Board) {
  const username = process.env.EVENT_USER_LOGIN || "cbebe";
  const args = getArgs(process.argv[2] || "sungka|new");

  const restartGame = args[0] === "new";

  const newBoard = restartGame
    ? newGame(board)
    : makeMove(board, <Side>args[0], Number(args[1]));

  jsonfile.readFile(dataFile, (err: Error, data: Data) => {
    let newData = { ...data };
    if (err) console.error(err);

    if (!restartGame) {
      newData = updateAfterTurn(
        newData,
        username,
        <Side>args[0],
        Number(args[1])
      );

      if (newBoard.gameOver) newData = updateAfterGame(newData, newBoard);
    } else {
      newData.mostRecentMoves = [];
    }

    writeToFiles(newBoard, newData);
  });
}

jsonfile.readFile(boardFile, (err: Error, board: Board) => {
  if (err) console.error(err);
  parseMove(board);
});
