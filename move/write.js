const instruction = "Just push 'Submit new issue' without changing the title";

const createHTTPText = (text, plus = false) => {
  return text
    .replace(/ /g, plus ? "+" : "%20")
    .replace(/'/g, "%27")
    .replace(/\|/g, "%7C");
};

const createIssueLink = (title, body, innerText) => {
  return `<a href="https://github.com/cbebe/chonka/issues/new?title=${title}&body=${body}">${innerText}</a>`;
};

const createMoveLink = (pos, side, score) => {
  const text = createHTTPText(
    `${instruction}. Please wait 30 seconds to check if you have an extra move or let someone else play the turn.`
  );

  return createIssueLink(`sungka%7C${side}%7C${pos}&`, text, score);
};

const createNewGameLink = () => {
  const text = createHTTPText(`${instruction} to start a new game.`);
  return createIssueLink("sungka%7Cnew&", text, "new game");
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

const createUserLink = name => {
  return `[@${name}](https://github.com/${name})`;
};

const createRecentMoves = data => {
  let tableStr = "|Username|Side|Hole Index|\n|-|-|-|\n";
  data.mostRecentMoves.forEach(({ name, side, idx }) => {
    tableStr += `|${createUserLink(name)}|${side}|${idx}|\n`;
  });
  return tableStr;
};

const parseStats = data => {
  const moves = data.games.totalMoves;
  const players = Object.keys(data.players).length;
  const games = data.games.totalGames;

  return [moves, players, games];
};

const createBadgeLink = (text, number, colour) => {
  return `![](https://img.shields.io/badge/${text}-${number}-${colour})`;
};

const createStatBadges = data => {
  const stats = parseStats(data);
  const colours = ["blue", "red", "green"];

  return [
    "Total%20moves%20played",
    "Number%20of%20players",
    "Games%20completed",
  ]
    .map((text, idx) => {
      createBadgeLink(text, stats[idx], colours[idx]);
    })
    .join("\n");
};

const createReadme = (board, data) => {
  let readMeText =
    "# Charles's community Mancala game\n\n" +
    createStatBadges(data) +
    "\nThis is Sungka, a Philippine mancala game. Anyone is free to participate!" +
    "Click here for the [rules](https://mancala.fandom.com/wiki/Sungka#Rules).\n" +
    "\nDirection of sowing is counter-clockwise (top goes to the left, bottom goes to the right).\n\n";

  const turnString = board.gameOver
    ? `The game is over! Click here to start a ${createNewGameLink()}.`
    : `It's ${
        board.currentTurn === "top" ? "top" : "bottom"
      } side's turn! Choose a hole to move.`;
  readMeText += [turnString, createTable(board), createRecentMoves(data)].join(
    "\n\n"
  );

  return readMeText;
};

module.exports = {
  createReadme,
  createHTTPText,
};
