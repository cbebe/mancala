const [_, side, idx] = process.argv[2].split("|");
const user = process.env.EVENT_USER_LOGIN;
const move = (user, side, idx) => `[@${user}](https://github.com/${user}) moved ${side}'s stones from pit ${idx}`;
const restart = (user) => `[@${user}](https://github.com/${user}) started a new game`;
process.stdout.write(side !== "new" ? move(user, side, Number(idx)) : restart(user));
