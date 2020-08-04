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
jsonfile.readFile(boardFile, (err, board) => {
    if (err)
        console.error(err);
    const envTitle = process.argv[2];
    const envUser = process.env.EVENT_USER_LOGIN;
    const title = envTitle || "sungka|new";
    const username = envUser || "cbebe";
    const args = getArgs(title);
    const restartGame = args[0] === "new";
    const newBoard = restartGame
        ? newGame(board)
        : makeMove(board, args[0], Number(args[1]));
    jsonfile.readFile(dataFile, (err, data) => {
        let newData = Object.assign({}, data);
        if (err)
            console.error(err);
        if (!restartGame) {
            newData = updateAfterTurn(newData, username, args[0], Number(args[1]));
            if (newBoard.gameOver)
                newData = updateAfterGame(newData, newBoard.currentTurn);
        }
        else {
            newData.mostRecentMoves = [];
        }
        writeToFiles(newBoard, newData);
    });
});
