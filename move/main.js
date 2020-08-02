const core = require("@actions/core");
const jsonfile = require("jsonfile");
const fs = require("fs");

const { makeMove, newGame } = require("./move.js");
const { createReadme } = require("./write.js");
const { updateAfterTurn, updateAfterGame } = require("./update.js");

const boardFile = "./board.json";
const dataFile = "./data.json";

function getArgs(title) {
  const args = title.split("|");
  return args.slice(1);
}
function writeToFiles(board, data) {
  jsonfile.writeFile(boardFile, board, { spaces: 2 }, err => {
    if (err) console.error(err);
  });
  jsonfile.writeFile(dataFile, data, { spaces: 2 }, err => {
    if (err) console.error(err);
  });
  fs.writeFileSync("./README.md", createReadme(board, data));
}

// Main script

jsonfile.readFile(boardFile, (err, obj) => {
  if (err) console.error(err);

  const title = core.getInput("title") || "sungka|new";
  const username = core.getInput("user") || "cbebe";
  const args = getArgs(title);

  const restartGame = args[0] === "new";
  const board = restartGame ? newGame(obj) : makeMove(obj, args[0], args[1]);
  jsonfile.readFile(dataFile, (err, obj) => {
    let data = { ...obj };
    if (err) console.error(err);

    if (!restartGame) {
      data = updateAfterTurn(data, username, args[0], args[1]);
      if (board.gameOver) data = updateAfterGame(data, board.currentTurn);
    }
    writeToFiles(board, data);
  });
});
