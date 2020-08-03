import jsonfile from "jsonfile";
import fs from "fs";
import { makeMove, newGame } from "./move.js";
import { createReadme } from "./write.js";
import { updateAfterTurn, updateAfterGame } from "./update.js";
const boardFile = "./board.json";
const dataFile = "./data.json";
function getArgs(title) {
    const args = title.split("|");
    return args.slice(1);
}
function writeToFiles(board, data) {
    jsonfile.writeFile(boardFile, board, { spaces: 2 }, (err) => {
        if (err)
            console.error(err);
    });
    jsonfile.writeFile(dataFile, data, { spaces: 2 }, (err) => {
        if (err)
            console.error(err);
    });
    fs.writeFileSync("./README.md", createReadme(board, data));
}
// Main script
jsonfile.readFile(boardFile, (err, obj) => {
    if (err)
        console.error(err);
    const envTitle = process.argv[2];
    const envUser = process.env.EVENT_USER_LOGIN;
    const title = envTitle || "sungka|new";
    const username = envUser || "cbebe";
    const args = getArgs(title);
    const restartGame = args[0] === "new";
    const board = restartGame
        ? newGame(obj)
        : makeMove(obj, args[0], Number(args[1]));
    jsonfile.readFile(dataFile, (err, obj) => {
        let data = Object.assign({}, obj);
        if (err)
            console.error(err);
        if (!restartGame) {
            data = updateAfterTurn(data, username, args[0], Number(args[1]));
            if (board.gameOver)
                data = updateAfterGame(data, board.currentTurn);
        }
        writeToFiles(board, data);
    });
});
