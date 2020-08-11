const [_, side, idx] = process.argv[2].split("|");
const user = process.env.EVENT_USER_LOGIN;
const move = (user, side, idx) => `@${user} moved ${side}'s shells from pit ${idx}`;
const restart = (user) => `@${user} started a new game`;
const ai = (user) => `Computer played a turn on behalf of @${user}`;
const newGame = side === "new";
const aiTurn = side === "ai";
process.stdout.write(newGame ? restart(user) : aiTurn ? ai(user) : move(user, side, Number(idx)));
