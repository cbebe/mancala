package main

const (
  instruction = "Just push 'Submit new issue' without changing the title"
pleaseWait =
  ". Please wait 30 seconds to check if you have an extra move or let someone else play the turn."
  github = "https://github.com/"
)

func createHTTPText(text string, plus bool) string {
  var p string
  if plus {
    p = "+"
  } else {
    p ="%20"
  }
  return strings.ReplaceAll(" ", p).ReplaceAll("'", "%27").ReplaceAll("|", "%7C")
}

func createIssueLink(title, body, innerText string) string {
  return fmt.Sprintf("<a href=\"%scbebe/cbebe/issues/new?title=%s&body=%s\">%s</a>", github, title, body, innerText)
}

func createUserLink(name string) string {
  return fmt.Sprintf("[@%s](%s)", name, github+name)
}

func parseStats(data Data) (int, int,int){
  return data.totalMoves, len(data.players), data.totalGames
}

func createBadgeLink(text string, number int, colour string) {
  return fmt.Sprintf("![](https://img.shields.io/badge/%s-%s-%s)", text, number, colour)
}

func createMoveLink(pos int, side Side, score int) string {
  text := createHTTPText(instruction + pleaseWait)
  title:=createHTTPText(fmt.Sprintf("sungka|%s|%d", side, pos))
  return createIssueLink(title, text, score)
}

func createAILink() string {
  text := createHTTPText(instruction + " to let the AI play for a turn.")
  return createIssueLink("sungka%7Cai", text, "Click here")
}


func createNewGameLink() string {
  text := createHTTPText(instruction + " to start a new game.")
  return createIssueLink("sungka%7Cnew", text, "new game")
}

func createRow(board Board, side Side) {
  isTurn := side == board.currentTurn;
  reversed = side ==Top;
  holeArray :=  [...board[side]];
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

function createMoveRow({ name, side, idx }: MoveObject) {
  const ai = idx < 0;
  const link = createUserLink(name);
  const player = ai ? `AI (${link})` : link;
  return `|${player}|${side}|${ai ? "--" : idx}|`;
}

function createRecentMoves(mostRecentMoves: MoveObject[]) {
  if (!mostRecentMoves.length) return "";

  const heading = "**Most Recent Moves**\n";
  const tableHead = "|Username|Side|Hole Index|\n|-|-|-|";
  const tableBody = mostRecentMoves.map(move => createMoveRow(move));

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
    ? `The game is over! Click here to start a ${createNewGameLink()}.`
    : `It's **${
        board.currentTurn === "top" ? "top" : "bottom"
      }** team's turn! Choose a hole to move. ${createAILink()} to **let the computer make a move**.`;

  const description = [
    "I am a student currently working on stuff I find fun",
    "Looking for Co-op/internships for **January-August 2021**",
  ].join("  \n");

  return [
    "# Hi, I'm Charles",
    description,
    "## Charles's community Mancala game",
    `![](${github}cbebe/cbebe/blob/master/sungka.png)`,
    createStatBadges(data),
    "This is Sungka, a Philippine mancala game. Anyone is free to participate!",
    rulesLink,
    "Direction of sowing is **counter-clockwise** (top goes to the left, bottom goes to the right).",
    turnString,
    createTable(board),
    createRecentMoves(data.mostRecentMoves),
    createRecentGames(data.mostRecentGames),
  ].join("\n\n");
}
