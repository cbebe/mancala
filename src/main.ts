import jsonfile from "jsonfile";
import fs from "fs";

import { Record, Side } from "./interfaces";
import { BoardMove, newGame, makeAIMove } from "./move.js";
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

function parseMove({ data, board }: Record) {
  const username = process.env.EVENT_USER_LOGIN || "cbebe";
  const args = getArgs(process.argv[2] || "sungka|ai");

  const restartGame = args[0] === "new";
  const aiMove = args[0] === "ai";

  let newBoard, aiSide: Side;

  if (restartGame) {
    newBoard = newGame(board);
  } else if (aiMove) {
    aiSide = <Side>board.currentTurn;
    newBoard = makeAIMove(board);
  } else {
    newBoard = new BoardMove(board, <Side>args[0]).makeMove(Number(args[1]));
  }

  let newData = { ...data };
  if (!restartGame) {
    const move = aiMove
      ? { side: aiSide, idx: -1 }
      : { side: <Side>args[0], idx: Number(args[1]) };
    newData = updateAfterTurn(newData, { name: username, ...move });

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
