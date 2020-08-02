const core = require("@actions/core");
const jsonfile = require("jsonfile");
const fs = require("fs");

const { makeMove } = require("./move.js");
const { writeReadme } = require("./write.js");

const file = "./board.json";

function getArgs(title) {
  const args = title.split("|");
  return args.slice(1);
}
function writeBoardToFiles(board) {
  jsonfile.writeFile(file, board, { spaces: 2 }, err => {
    if (err) console.error(err);
  });
  fs.writeFileSync("./README.md", writeReadme(board));
}

// Main script

const newBoard = {
  currentTurn: "top",
  top: [7, 7, 7, 7, 7, 7, 7],
  bot: [7, 7, 7, 7, 7, 7, 7],
  scores: {
    top: 0,
    bot: 0,
  },
  gameOver: false,
};

jsonfile.readFile(file, (err, obj) => {
  if (err) console.error(err);

  const title = core.getInput("title") || "sungka|new";
  const args = getArgs(title);

  const res =
    args[0] === "new" ? newBoard : makeMove(obj, args[0], Number(args[1]));
  writeBoardToFiles(res);
});
