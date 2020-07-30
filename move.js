const jsonfile = require("jsonfile");
const file = "./board.json";

function makeMove(board) {
  board.left[1] -= 1;
  return board;
}

jsonfile.readFile(file, (err, obj) => {
  if (err) console.error(err);

  const res = makeMove(obj);

  jsonfile.writeFile(file, res, { spaces: 2 }, err => {
    if (err) console.error(err);
  });
});
