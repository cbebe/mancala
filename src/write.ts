import { Board, Data } from "./interfaces";
const instruction = "Just push 'Submit new issue' without changing the title";

export const createHTTPText = (text: string, plus = false) => {
  return text
    .replace(/ /g, plus ? "+" : "%20")
    .replace(/'/g, "%27")
    .replace(/\|/g, "%7C");
};

const createIssueLink = (title: string, body: string, innerText: string) => {
  return `<a href="https://github.com/cbebe/chonka/issues/new?title=${title}&body=${body}">${innerText}</a>`;
};

const createMoveLink = (pos: number, side: "top" | "bot", score: number) => {
  const text = createHTTPText(
    `${instruction}. Please wait 30 seconds to check if you have an extra move or let someone else play the turn.`
  );

  return createIssueLink(`sungka%7C${side}%7C${pos}&`, text, String(score));
};

const createNewGameLink = () => {
  const text = createHTTPText(`${instruction} to start a new game.`);
  return createIssueLink("sungka%7Cnew&", text, "new game");
};

const createRow = (board: Board, side: "top" | "bot") => {
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

const createTable = (board: Board) => {
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

const createUserLink = (name: string) => {
  return `[@${name}](https://github.com/${name})`;
};

const createRecentMoves = (data: Data) => {
  const heading = "**Most Recent Moves**\n\n";
  let tableStr = "|Username|Side|Hole Index|\n|-|-|-|\n";
  data.mostRecentMoves.forEach(({ name, side, idx }) => {
    tableStr += `|${createUserLink(name)}|${side}|${idx}|\n`;
  });
  return heading + tableStr;
};

const parseStats = (data: Data) => {
  const moves = data.games.totalMoves;
  const players = Object.keys(data.players).length;
  const games = data.games.totalGames;

  return [moves, players, games];
};

const createBadgeLink = (text: string, number: number, colour: string) => {
  return `![](https://img.shields.io/badge/${text}-${number}-${colour})`;
};

const createStatBadges = (data: Data) => {
  const stats = parseStats(data);
  const colours = ["blue", "red", "green"];

  return [
    "Total%20moves%20played",
    "Number%20of%20players",
    "Games%20completed",
  ]
    .map((text, idx) => createBadgeLink(text, stats[idx], colours[idx]))
    .join("\n");
};

export const createReadme = (board: Board, data: Data) => {
  const rulesLink =
    " **Click on one of the holes** in the board to make a move. If you're not familiar with the game, click here for the [rules](https://mancala.fandom.com/wiki/Sungka#Rules).";

  const turnString = board.gameOver
    ? `The game is over! :grin: Click here to start a ${createNewGameLink()}.`
    : `It's **${
        board.currentTurn === "top" ? "top" : "bottom"
      }** team's turn! :muscle: Choose a hole to move.`;

  const description =
    "I am a student currently working on stuff I find fun :octopus:";

  return [
    "# Hi, I'm Charles :v:",
    description,
    "## :shell: Charles's community Mancala game",
    '![]("sungka.png")',
    createStatBadges(data),
    "This is Sungka, a Philippine mancala game. :wave: Anyone is free to participate!",
    rulesLink,
    "Direction of sowing is **counter-clockwise** (top goes to the left, bottom goes to the right).",
    turnString,
    createTable(board),
    createRecentMoves(data),
  ].join("\n\n");
};
