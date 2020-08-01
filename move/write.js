const createLink = (pos, side, score) => {
  const issue = "https://github.com/cbebe/chonka/issues/new?";
  const title = `title=sungka%7C${side}%7C${pos}&`;
  const body = "body=Just+push+%27Submit+new+issue%27.";
  return `<a href="${issue}${title}${body}">${score}</a>`;
};

const createRow = (side, arr, currentTurn) => {
  const isTurn = side === currentTurn;
  let arrCopy = [...arr];
  if (side === "bot") arrCopy = arrCopy.reverse();
  return arr
    .map(
      (score, idx) =>
        `<td>${isTurn ? createLink(idx, side, score) : score}</td>\n`
    )
    .join("");
};

const createTable = board => {
  let tableStr =
    "<table>\n<thead>\n<tr>\n<th>Top</th>\n" +
    "<th colspan=7>Holes</th>\n<th>Bottom</th>\n</tr>\n</thead>\n<tbody>\n";

  const topScore = `<tr>\n<td rowspan=2>${board.scores.top}</td>\n`;
  const topRow = createRow("top", board.top, board.currentTurn);
  const botScore = `<td rowspan=2>${board.scores.bot}</td>\n</tr>\n<tr>\n`;
  const botRow = createRow("bot", board.bot, board.currentTurn);

  tableStr +=
    topScore + topRow + botScore + botRow + "</tr>\n<tbody>\n</table>\n";

  return tableStr;
};

const writeReadme = board => {
  const rulesLink = "https://mancala.fandom.com/wiki/Sungka#Rules";
  let readMeText =
    "# Charles's community Mancala game\n" +
    "\n## WORK IN PROGRESS\n\nThis is Sungka, a Philippine mancala game. " +
    `Click here for the [rules](${rulesLink}).\n`;

  const turnString = `\nIt's ${
    board.currentTurn === "top" ? "top" : "bottom"
  } side's turn! Choose a hole to move.\n\n`;

  readMeText += turnString + createTable(board);

  return readMeText;
};

module.exports = { writeReadme };
