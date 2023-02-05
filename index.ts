// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

const gameDate = {
  board: {
    height: 19,
    width: 19,
    snakes: [
      {
        id: "gs_HxfTjrT6h8FvHCrxS83qyb3Q",
        name: "Hungry Bot",
        latency: "1",
        health: 99,
        body: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 1 },
        ],
        head: { x: 0, y: 1 },
        length: 3,
        shout: "",
        squad: "",
        customizations: {
          color: "#00cc00",
          head: "alligator",
          tail: "alligator",
        },
      },
      {
        id: "gs_WMTWPGhS6BXt4DY6KwXBBPS8",
        name: "rachouan",
        latency: "500",
        health: 99,
        body: [
          { x: 17, y: 18 },
          { x: 17, y: 17 },
          { x: 17, y: 17 },
        ],
        head: { x: 17, y: 18 },
        length: 3,
        shout: "",
        squad: "",
        customizations: { color: "#888888", head: "default", tail: "default" },
      },
    ],
    food: [
      { x: 0, y: 2 },
      { x: 18, y: 16 },
      { x: 9, y: 9 },
    ],
  },
};

import runServer from "./server";
import { GameState, InfoResponse, MoveResponse, Board } from "./types";

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info(): InfoResponse {
  return {
    apiversion: "1",
    author: "rachouan", // TODO: Your Battlesnake Username
    color: "#f0f0f0", // TODO: Choose color
    head: "default", // TODO: Choose head
    tail: "default", // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState: GameState): void {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState: GameState): void {
  console.log("GAME OVER\n");
}

function generateBoard(board: Board) {
  const boardArr = Array(board.height)
    .fill(0)
    .map(() => Array(board.width).fill(0));

  board.food.forEach((food) => {
    boardArr[food.y][food.x] = 1;
  });

  board.snakes.forEach((snake) => {
    snake.body.forEach((body) => {
      let value = snake.name === info().author ? 0 : 2;
      boardArr[body.y][body.x] = value;
    });
  });

  return boardArr;
}

function moveDelta(move: string) {
  switch (move) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    default:
      return { x: 1, y: 0 };
  }
}

function checkSafeMoves(board: number[][], x: number, y: number) {
  if (x < 0 || x > board[0].length - 1) return false;
  if (y < 0 || y > board.length - 1) return false;
  if (board[y][x] === 2) return false;
  return true;
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState: GameState): MoveResponse {
  // We've included code to prevent your Battlesnake from moving backwards
  const head = gameState.you.body[0];
  // const neck = gameState.you.body[1];

  const board = generateBoard(gameState.board);

  let isMoveSafe: { [key: string]: boolean } = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key: string) =>
    checkSafeMoves(board, head.x + moveDelta(key).x, head.y + moveDelta(key).y)
  );

  // Object.keys(isMoveSafe).filter((key) => isMoveSafe[key])
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});
