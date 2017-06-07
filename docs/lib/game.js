const Board = require("./board");
const READY = "READY";
const INIT = "INIT";
const RESOLVE = "RESOLVE";

class Game {
  constructor(context) {
    this.lastTime = 0;
    this.drag = false;
    this.gamestate = INIT;
    this.showmoves = false;
    this.gameover = false;
    this.animationTime = 0;
    this.animationState = 0;
    this.animationTimetotal = 0.3;
    this.demo = false;
    this.score = 0;
    this.context = context;
    this.board = new Board(this.context, this);
    this.mousetarget = { valid: false, x: 0, y: 0 };
    this.currentMove = { toCol: 0, toRow: 0, fromCol: 0, fromRow: 0 };
    this.time = 180;
    this.countdown;
    this.setup();
    // this.timer();
  }

  setup() {
    canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    canvas.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.board.createNew();

    this.newGame();
  }

  newGame() {
    this.gamestate = READY;

    this.board.randomize();
    this.board.findMoves();
    this.board.findMatches();
    this.render();
  }

  resetGame() {
    this.lastTime = 0;
    this.drag = false;
    this.gamestate = INIT;
    this.showmoves = false;
    this.gameover = false;
    this.animationTime = 0;
    this.animationState = 0;
    this.animationTimetotal = 0.3;
    this.demo = false;
    this.score = 0;
    this.board = new Board(this.context, this);
    this.mousetarget = { valid: false, x: 0, y: 0 };
    this.currentMove = { toCol: 0, toRow: 0, fromCol: 0, fromRow: 0 };
    this.time = 180;
    this.setup();
    this.timer();
  }

  start(time) {
    this.update(time);
    this.render();
    window.requestAnimationFrame(this.start.bind(this));
  }

  toggleDemo() {
    this.demo = !this.demo
  }

  timer() {
    this.countdown = setInterval(() => {
      this.time--;
      if (this.time == 0){
        this.gameover = true;
        clearInterval(this.countdown);
      }
    }, 1000);
  }

  pause() {
    clearInterval(this.countdown);
  }

  unpause() {
    if (this.gameover == false){
      this.timer();
    }
  }

  update(time) {
    const timeDelta = (time - this.lastTime) / 1000;

    this.lastTime = time;
    if (this.gamestate == READY) {
      if (this.board.moves.length <= 0) {
        this.gameover = true;
      }

      if (this.demo && !this.gameover) {
        this.animationTime += timeDelta;
        if (this.animationTime > this.animationTimetotal) {
          this.board.findMoves();

          if (this.board.moves.length > 0) {
            let move = this.board.moves[Math.floor(Math.random() * this.board.moves.length)];
            this.swapTiles(move.toCol, move.toRow, move.fromCol, move.fromRow);
          }
          this.animationTime = 0;
        }
      }
    } else if (this.gamestate == RESOLVE) {
      this.animationTime += timeDelta;

      if (this.animationState == 0) {
        if (this.animationTime > this.animationTimetotal) {
          this.board.findMatches();

          if (this.board.matches.length > 0) {
            for (let i = 0; i < this.board.matches.length; i++) {
              this.score += 100 * (this.board.matches[i].length - 2);
            }

            this.board.removeMatches();
            this.animationState = 1;
          } else {
            this.gamestate = READY;
          }

          this.animationTime = 0;
        }
      } else if (this.animationState == 1) {
        if (this.animationTime > this.animationTimetotal) {
          this.board.shiftTiles();
          this.animationState = 0;
          this.animationTime = 0;
          this.board.findMatches();

          if (this.board.matches.length <= 0) {
            this.gamestate = READY;
          }
        }
      } else if (this.animationState == 2) {
        if (this.animationTime > this.animationTimetotal) {
          this.board.swap(this.currentMove.toCol, this.currentMove.toRow, this.currentMove.fromCol, this.currentMove.fromRow);
          this.board.findMatches();

          if (this.board.matches.length > 0) {
            this.animationState = 0;
            this.animationTime = 0;
            this.gamestate = RESOLVE;
          } else {
            this.animationState = 3;
            this.animationTime = 0;
          }

          this.board.findMoves();
          this.board.findMatches();
        }
      } else if (this.animationState == 3) {
        if (this.animationTime > this.animationTimetotal) {
          this.board.swap(this.currentMove.toCol, this.currentMove.toRow, this.currentMove.fromCol, this.currentMove.fromRow);

          this.gamestate = READY;
        }
      }

      this.board.findMoves();
      this.board.findMatches();
    }
  }

  renderText(text, x, y, width) {
    let textSize = this.context.measureText(text);
    let padding = (width-textSize.width)/2
    this.context.fillText(text, x + padding, y);
  }

  render() {
    this.renderScore();
    this.renderTime();

    let boardwidth = this.board.columns * this.board.tilewidth;
    let boardheight = this.board.rows * this.board.tileheight;

    this.context.fillStyle = "#000000";
    this.context.fillRect(this.board.x - 6, this.board.y - 6, boardwidth + 12, boardheight + 12);
    this.context.fillStyle = "#7fbfe2";
    this.context.fillRect(this.board.x - 4, this.board.y - 4, boardwidth + 8, boardheight + 8);

    this.board.renderTiles();

    if (this.showmoves && this.board.matches.length <= 0 && this.gamestate == READY) {
      this.board.renderMoves();
    }

    if (this.gameover) {
      this.context.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.context.fillRect(this.board.x, this.board.y, boardwidth, boardheight);

      this.context.fillStyle = "#ffffff";
      this.context.font = "24px Verdana";
      this.renderText("Game Over!", this.board.x, this.board.y + boardheight / 2 + 10, boardwidth);
    }
  }

  renderScore() {
    document.getElementById("score").innerHTML = this.score;
  }

  renderTime() {
    document.getElementById("time").innerHTML = this.formatTime(this.time);
  }

  formatTime(time) {
    let mins = parseInt(time / 60)
    let secs = time % 60
    secs = secs < 10 ? `0${secs}` : secs

    return `${mins}:${secs}`
  }

  getMouseTile(pos) {
    let tileX = Math.floor((pos.x - this.board.x) / this.board.tilewidth);
    let tileY = Math.floor((pos.y - this.board.y) / this.board.tileheight);

    if (tileX >= 0 && tileX < this.board.columns && tileY >= 0 && tileY < this.board.rows) {
      return {
        valid: true,
        x: tileX,
        y: tileY
      };
    }

    return {
      valid: false,
      x: 0,
      y: 0
    };
  }

  checkSwap(x1, y1, x2, y2) {
    if ((Math.abs(x1 - x2) == 1 && y1 == y2) ||
        (Math.abs(y1 - y2) == 1 && x1 == x2)) {
      return true;
    }

    return false;
  }

  swapTiles(col1, row1, col2, row2) {
    this.currentMove = {toCol: col1, toRow: row1, fromCol: col2, fromRow: row2};

    this.board.selectedTile.selected = false;
    this.animationState = 2;
    this.animationTime = 0;
    this.gamestate = RESOLVE;
  }

  onMouseMove(e) {
    let pos = this.getMousePos(canvas, e);

    if (this.drag && this.board.selectedTile.selected) {
      this.mousetarget = this.getMouseTile(pos);
      if (this.mousetarget.valid) {
        if (this.checkSwap(this.mousetarget.x, this.mousetarget.y, this.board.selectedTile.column, this.board.selectedTile.row)){
          this.swapTiles(this.mousetarget.x, this.mousetarget.y, this.board.selectedTile.column, this.board.selectedTile.row);
        }
      }
    }
  }

  onMouseDown(e) {
    let pos = this.getMousePos(canvas, e);

    if (!this.drag && !this.gameover) {
      this.mousetarget = this.getMouseTile(pos);

      if (this.mousetarget.valid) {
        let swapped = false;
        if (this.board.selectedTile.selected) {
          if (this.mousetarget.x == this.board.selectedTile.column && this.mousetarget.y == this.board.selectedTile.row) {
            this.board.selectedTile.selected = false;
            this.drag = true;
            return;
          } else if (this.checkSwap(this.mousetarget.x, this.mousetarget.y, this.board.selectedTile.column, this.board.selectedTile.row)){
            this.swapTiles(this.mousetarget.x, this.mousetarget.y, this.board.selectedTile.column, this.board.selectedTile.row);
            swapped = true;
          }
        }

        if (!swapped) {
          this.board.selectedTile.column = this.mousetarget.x;
          this.board.selectedTile.row = this.mousetarget.y;
          this.board.selectedTile.selected = true;
        }
      } else {
        this.board.selectedTile.selected = false;
      }

      this.drag = true;
    }

  }

  onMouseUp(e) {
    this.drag = false;
  }

  onMouseOut(e) {
    this.drag = false;
  }

  getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();

    return {
      x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
      y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
    };
  }

}

module.exports = Game;
