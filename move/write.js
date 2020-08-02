const fs = require("fs");

const createMoveLink = (pos, side, score) => {
  const issue = "https://github.com/cbebe/chonka/issues/new?";
  const title = `title=sungka%7C${side}%7C${pos}&`;
  const body =
    "body=Just+push+%27Submit+new+issue%27+without+changing+the+title.+Please+wait+30+seconds+to+check+if+you+have+an+extra+move+or+let+someone+else+play+the+turn.";
  return `<a href="${issue}${title}${body}">${score}</a>`;
};

const createNewGameLink = () => {
  const issue = "https://github.com/cbebe/chonka/issues/new?";
  const title = `title=sungka%7Cnew&`;
  const body =
    "body=Just+push+%27Submit+new+issue%27+without+changing+the+title+to+start+a+new+game.";
  return `<a href="${issue}${title}${body}">new game</a>`;
};

const createRow = (board, side) => {
  const isTurn = side === board.currentTurn;
  const reversed = side === "top";
  let holeArray = [...board[side]];
  holeArray = reversed ? holeArray.reverse() : holeArray;

  return holeArray
    .map(
      (score, idx) =>
        `<td>${
          isTurn && score
            ? createMoveLink(reversed ? 6 - idx : idx, side, score)
            : score
        }</td>\n`
    )
    .join("");
};

const createTable = board => {
  let tableStr =
    "<table>\n<thead>\n<tr>\n<th>Top</th>\n" +
    "<th colspan=7>Holes</th>\n<th>Bottom</th>\n</tr>\n</thead>\n<tbody>\n";

  const topScore = `<tr>\n<td rowspan=2>${board.scores.top}</td>\n`;
  const topRow = createRow(board, "top");
  const botScore = `<td rowspan=2>${board.scores.bot}</td>\n</tr>\n<tr>\n`;
  const botRow = createRow(board, "bot");

  tableStr +=
    topScore + topRow + botScore + botRow + "</tr>\n<tbody>\n</table>\n";

  return tableStr;
};

const writeReadme = board => {
  const rulesLink = "https://mancala.fandom.com/wiki/Sungka#Rules";
  let readMeText =
    "# Charles's community Mancala game\n" +
    "\n## WORK IN PROGRESS\n\nThis is Sungka, a Philippine mancala game. " +
    "Anyone is free to participate! " +
    `Click here for the [rules](${rulesLink}).\n` +
    "\nDirection of sowing is counter-clockwise (top goes to the left, bottom goes to the right).\n";

  const turnString = board.gameOver
    ? `The game is over! Click here to start a ${createNewGameLink()}.`
    : `\nIt's ${
        board.currentTurn === "top" ? "top" : "bottom"
      } side's turn! Choose a hole to move.\n\n`;

  readMeText += turnString + createTable(board);

  return readMeText;
};

// for testing

// const board = {
//   currentTurn: "top",
//   top: [0, 0, 0, 0, 0, 0, 0],
//   bot: [0, 0, 0, 0, 0, 0, 0],
//   scores: { top: 0, bot: 0 },
//   gameOver: true,
// };

// console.log(writeReadme(board));

module.exports = { writeReadme };
