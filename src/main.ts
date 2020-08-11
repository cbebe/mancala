import jsonfile from "jsonfile";
import fs from "fs";

import { Record, Board, Data, Side } from "./interfaces";
import { makeMove, newGame } from "./move.js";
import { createReadme } from "./write.js";
import { updateAfterTurn, updateAfterGame } from "./update.js";

const recordFile = "./record.json";

const getArgs = (title: string) => title.split("|").slice(1);

function writeToFiles(record: Record) {
  jsonfile.writeFile(recordFile, record, { spaces: 2 }, (err: Error) => {
    if (err) console.error(err);
  });
  fs.writeFileSync("./README.md", createReadme(record));
}

// Main script

function parseMove({ data, board }: Record) {
  const username = process.env.EVENT_USER_LOGIN || "cbebe";
  const args = getArgs(process.argv[2] || "sungka|new");

  const restartGame = args[0] === "new";

  const newBoard = restartGame
    ? newGame(board)
    : makeMove(board, <Side>args[0], Number(args[1]));

  let newData = { ...data };
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

  writeToFiles({ data: newData, board: newBoard });
}

jsonfile.readFile(recordFile, (err: Error, record: Record) => {
  if (err) console.error(err);
  parseMove(record);
});
