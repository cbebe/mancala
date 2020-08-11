import { Board, Data, Record, GameRecord, MoveObject } from "./interfaces";
const instruction = "Just push 'Submit new issue' without changing the title";
const pleaseWait =
  ". Please wait 30 seconds to check if you have an extra move or let someone else play the turn.";
const github = "https://github.com/";

export const createHTTPText = (text: string, plus = false) =>
  text
    .replace(/ /g, plus ? "+" : "%20")
    .replace(/'/g, "%27")
    .replace(/\|/g, "%7C");

const createIssueLink = (title: string, body: string, innerText: string) =>
  `<a href="${github}cbebe/cbebe/issues/new?title=${title}&body=${body}">${innerText}</a>`;

const createUserLink = (name: string) => `[@${name}](${github + name})`;

const parseStats = (data: Data) => [
  data.totalMoves,
  Object.keys(data.players).length,
  data.totalGames,
];

const createBadgeLink = (text: string, number: number, colour: string) =>
  `![](https://img.shields.io/badge/${text}-${number}-${colour})`;

function createMoveLink(pos: number, side: "top" | "bot", score: number) {
  const text = createHTTPText(instruction + pleaseWait);
  return createIssueLink(`sungka%7C${side}%7C${pos}&`, text, String(score));
}

function createNewGameLink() {
  const text = createHTTPText(instruction + " to start a new game.");
  return createIssueLink("sungka%7Cnew&", text, "new game");
}

function createRow(board: Board, side: "top" | "bot") {
  const isTurn = side === board.currentTurn;
  const reversed = side === "top";
  let holeArray = [...board[side]];
  if (reversed) holeArray = holeArray.reverse();

  const rowStr = holeArray.map((shells, idx) => {
    const needLink = isTurn && shells;
    const pos = reversed ? 6 - idx : idx;
    return `<td>${needLink ? createMoveLink(pos, side, shells) : shells}</td>`;
  });

  return rowStr.join("\n");
}

function createTable(board: Board) {
  const score = (i: number) => `<td rowspan=2>${i}</td>`;

  const tableHead = `<table>\n<thead>\n<tr>\n<th>Top</th>\n<th colspan=7>Holes</th>\n<th>Bottom</th>\n</tr>\n</thead>\n<tbody>`;
  const tableTail = "</tr>\n<tbody>\n</table>";

  const topScore = `<tr>${score(board.scores.top)}\n`;
  const topRow = createRow(board, "top");
  const botScore = score(board.scores.bot) + "\n</tr>\n<tr>";
  const botRow = createRow(board, "bot");

  return [tableHead, topScore, topRow, botScore, botRow, tableTail].join("\n");
}

function createRecentMoves(mostRecentMoves: MoveObject[]) {
  if (mostRecentMoves.length === 0) return "";

  const heading = "**Most Recent Moves**\n";
  const tableHead = "|Username|Side|Hole Index|\n|-|-|-|";
  const tableBody = mostRecentMoves.map(
    ({ name, side, idx }) => `|${createUserLink(name)}|${side}|${idx}|`
  );

  return [heading, tableHead, ...tableBody].join("\n");
}

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

export function createRecentGames(mostRecentGames: GameRecord[]) {
  const heading = "**Most Recent Games**\n";
  const tableHead = "|Top Score|Bottom Score|Turns Played|\n|-|-|-|";
  const games = mostRecentGames.map(
    ({ scores, turnsPlayed }) => `|${scores.top}|${scores.bot}|${turnsPlayed}|`
  );
  return [heading, tableHead, ...games].join("\n");
}

export function createReadme({ board, data }: Record) {
  const rulesLink =
    "**Click on one of the holes** in the board to make a move. If you're not familiar with the game, click here for the [rules](https://mancala.fandom.com/wiki/Sungka#Rules).";

  const turnString = board.gameOver
    ? `The game is over! :grin: Click here to start a ${createNewGameLink()}.`
    : `It's **${
        board.currentTurn === "top" ? "top" : "bottom"
      }** team's turn! :muscle: Choose a hole to move.`;

  const description = [
    "I am a student currently working on stuff I find fun :octopus:",
    "Looking for Co-op/internships for Jan-August 2021 :briefcase:",
  ];

  return [
    "# Hi, I'm Charles :v:",
    ...description,
    "## :shell: Charles's community Mancala game",
    `![](${github}cbebe/cbebe/blob/master/sungka.png)`,
    createStatBadges(data),
    "This is Sungka, a Philippine mancala game. :wave: Anyone is free to participate!",
    rulesLink,
    "Direction of sowing is **counter-clockwise** (top goes to the left, bottom goes to the right).",
    turnString,
    createTable(board),
    createRecentMoves(data.mostRecentMoves),
    createRecentGames(data.mostRecentGames),
  ].join("\n\n");
}
