const [_, side, idx] = process.argv[2].split("|");
const user = process.env.EVENT_USER_LOGIN;
const move = (user, side, idx) => `@${user} moved ${side}'s shells from pit ${idx}`;
const restart = (user) => `@${user} started a new game`;
process.stdout.write(side !== "new" ? move(user, side, Number(idx)) : restart(user));
