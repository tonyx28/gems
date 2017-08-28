const Game = require("./game");
const Board = require("./board.js");


document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("canvas");
  const ctx = canvasEl.getContext("2d");

  const modal = document.getElementById('about-modal');
  const aboutButton = document.getElementById('about-btn');
  const span = document.getElementsByClassName("close")[0];
  const demoButton = document.getElementById('demo-btn');
  const newGameButton = document.getElementById('new-game-btn');

  const game = new Game(ctx);
  game.start(0);
  game.pause();

  aboutButton.onclick = () => {
    modal.style.display = "block";
    game.pause();
  }

  span.onclick = () => {
    modal.style.display = "none";
    game.unpause();
  }

  window.onclick = () => {
    if (event.target == modal) {
      modal.style.display = "none";
      game.unpause();
    }
  }

  newGameButton.onclick = () => {
    game.resetGame();
    game.start(0);
  }

  demoButton.onclick = () => {
    game.toggleDemo();
  }
})
