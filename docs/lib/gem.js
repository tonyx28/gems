const Game = require("./game");
const Board = require("./board.js");

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("canvas");

  const ctx = canvasEl.getContext("2d");
  const game = new Game(ctx);
  game.start(0);
})
