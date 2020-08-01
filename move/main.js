const core = require("@actions/core");
const jsonfile = require("jsonfile");
const file = "./board.json";

function getArgs(title) {
  const args = title.split("|");
  return args.slice(1);
}

// Main script
jsonfile.readFile(file, (err, obj) => {
  if (err) console.error(err);

  const title = core.getInput("title") || "sungka|bot|2";
  const args = getArgs(title);
  const res = makeMove(obj, args[0], Number(args[1]));

  if (!equalBoards(obj, res)) {
    jsonfile.writeFile(file, res, { spaces: 2 }, err => {
      if (err) console.error(err);
    });
  }
});
