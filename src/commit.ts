const [_, side, idx] = process.argv[2].split("|");
const user = process.env.EVENT_USER_LOGIN;

const move = (user: string, side: string, idx: number) =>
  `@${user}] moved ${side}'s stones from pit ${idx}`;

const restart = (user: string) => `@${user} started a new game`;

process.stdout.write(
  side !== "new" ? move(user, side, Number(idx)) : restart(user)
);
