const core = require("@actions/core");
const jsonfile = require("jsonfile");
const file = "./board.json";

function getOtherSide(currentSide) {
  return currentSide === "top" ? "bot" : "top";
}

function makeMove(board, side, holeIdx) {
  const newBoard = { ...board };
  const otherSide = getOtherSide(side);
  let stones = newBoard[side][holeIdx];
  if (!stones && side !== newBoard.currentTurn) return newBoard;
  newBoard[side][holeIdx] = 0;
  let startingIdx = holeIdx + 1;
  let currentSide = side;
  while (stones > 0) {
    for (let i = startingIdx; stones && i < 7; ++i) {
      if (stones === 1) {
        stones === ++newBoard[currentSide][i];
      } else {
        stones--;
        newBoard[currentSide][i]++;
      }
    }
    if (stones && currentSide === side) {
      newBoard.scores[side]++;
      stones--;
    }
    currentSide = getOtherSide(currentSide);
    startingIdx = 0;
  }
  newBoard.currentTurn = otherSide;
  return newBoard;
}

function getArgs(title) {
  const args = title.split("|");
  return args.slice(1);
}

jsonfile.readFile(file, (err, obj) => {
  if (err) console.error(err);

  const title = core.getInput("title") || "sungka|bot|2";
  const args = getArgs(title);
  const res = makeMove(obj, args[0], Number(args[1]));

  jsonfile.writeFile(file, res, { spaces: 2 }, err => {
    if (err) console.error(err);
  });
});
