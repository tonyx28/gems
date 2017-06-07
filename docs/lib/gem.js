const Game = require("./game");
const Board = require("./board.js");

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("canvas");

  const ctx = canvasEl.getContext("2d");
  const game = new Game(ctx);
  game.start(0);

  // var
  var modal = document.getElementById('about-modal');
  var aboutButton = document.getElementById('about-btn');
  var span = document.getElementsByClassName("close")[0];
  var demoButton = document.getElementById('demo-btn');
  var newGameButton = document.getElementById('new-game-btn');


  aboutButton.onclick = () => {
    modal.style.display = "block";
  }

  span.onclick = () => {
    modal.style.display = "none";
  }

  window.onclick = () => {
    if (event.target == modal) {
      modal.style.display = "none";
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
