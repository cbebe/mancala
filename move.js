const jsonfile = require("jsonfile");
const file = "./board.json";

const args = process.argv.slice(2);

function makeMove(board) {
  return board;
}

jsonfile.readFile(file, (err, obj) => {
  if (err) console.error(err);

  const res = makeMove(obj);

  jsonfile.writeFile(file, res, { spaces: 2 }, err => {
    if (err) console.error(err);
  });
});
