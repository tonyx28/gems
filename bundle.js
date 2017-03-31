/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Board {
  constructor(context, game) {
    this.x = 250;
    this.y = 113;
    this.columns = 8;
    this.rows= 8;
    this.tilewidth= 40;
    this.tileheight= 40;
    this.tiles = [];
    this.selectedTile= { selected: false, column: 0, row: 0 };
    this.matches = [];
    this.moves = 0;
    this.context = context;
    this.game = game;
    const red = new Image();
    red.src = "http://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/red_yrl9n3.png";
    red.crossOrigin = 'anonymous';
    const green = new Image();
    green.src = "http://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/green_kjadgp.png";
    green.crossOrigin = 'anonymous';
    const blue = new Image();
    blue.src = "http://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/blue_hmzor9.png";
    blue.crossOrigin = 'anonymous';
    const white = new Image();
    white.src = "http://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/white_nbuppm.png";
    white.crossOrigin = 'anonymous';
    const purple = new Image();
    purple.src = "http://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/purple_pzs9kv.png";
    purple.crossOrigin = 'anonymous';
    const yellow = new Image();
    yellow.src = "http://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/yellow_g98763.png";
    yellow.crossOrigin = 'anonymous';
    this.colors = [red, green, blue, white, purple, yellow];
  }

  createNew(){
    for (let i = 0; i < this.columns; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.tiles[i][j] = { type: 0, shift:0 }
      }
    }
  }

  randomize() {
    let done = false;

    while (!done){
      for (let i = 0; i < this.columns; i++) {
          for (let j = 0; j < this.rows; j++) {
              this.tiles[i][j].type = this.getRandomTile();
          }
      }
      this.resolveMatches();
      this.findMoves();
      if (this.moves.length > 0){
        done = true;
      }
    }
  }

  getRandomTile() {
    return Math.floor(Math.random() * this.colors.length);
  }

  resolveMatches() {
      this.findMatches();

      while (this.matches.length > 0) {
          this.removeMatches();
          this.shiftTiles();
          this.findMatches();
      }
  }

  findMatches() {
    this.matches = [];

    for (let j = 0; j < this.rows; j++) {
      let matchlength = 1;
      for (let i = 0; i < this.columns; i++) {
        let checkMatch = false;

        if (i == this.columns-1) {
          checkMatch = true;
        } else {
          if (this.tiles[i][j].type == this.tiles[i+1][j].type &&
              this.tiles[i][j].type != -1) {
            matchlength += 1;
          } else {
            checkMatch = true;
          }
        }

        if (checkMatch) {
          if (matchlength >= 3) {
            this.matches.push({ column: i+1-matchlength, row:j,
                                length: matchlength, horizontal: true });
          }
          matchlength = 1;
        }
      }
    }

    for (let i = 0; i < this.columns; i++) {
        let matchlength = 1;
        for (let j = 0; j < this.rows; j++) {
          let checkMatch = false;

          if (j == this.rows-1) {
            checkMatch = true;
          } else {
            if (this.tiles[i][j].type == this.tiles[i][j+1].type &&
                this.tiles[i][j].type != -1) {
              matchlength += 1;
            } else {
              checkMatch = true;
            }
          }

          if (checkMatch) {
            if (matchlength >= 3) {
              this.matches.push({ column: i, row:j+1-matchlength,
                                  length: matchlength, horizontal: false });
            }
            matchlength = 1;
          }
        }
    }
  }

  findMoves() {
    this.moves = [];

    for (let j = 0; j < this.rows; j++) {
        for (let i = 0; i < this.columns-1; i++) {
          this.swap(i, j, i+1, j);
          this.findMatches();
          this.swap(i, j, i+1, j);

          if (this.matches.length > 0) {
            this.moves.push({toCol: i, toRow: j, fromCol: i+1, fromRow: j});
          }
        }
    }

    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows-1; j++) {
        this.swap(i, j, i, j+1);
        this.findMatches();
        this.swap(i, j, i, j+1);

        if (this.matches.length > 0) {
          this.moves.push({toCol: i, toRow: j, fromCol: i, fromRow: j+1});
        }
      }
    }

    this.matches = [];
  }

  loopMatches(callback) {
    for (let i = 0; i < this.matches.length; i++) {
      let match = this.matches[i];
      let colOffset = 0;
      let rowOffset = 0;
      for (let j = 0; j < match.length; j++) {
        callback(i, match.column + colOffset, match.row + rowOffset, match);

        if (match.horizontal) {
          colOffset++;
        } else {
          rowOffset++;
        }
      }
    }
  }

  removeMatches() {
    this.loopMatches((index, column, row, match) => { this.tiles[column][row].type = -1; });

    for (let i = 0; i < this.columns; i++) {
      let shift = 0;
      for (let j = this.rows-1; j >= 0; j--) {
        if (this.tiles[i][j].type == -1) {
          shift++;
          this.tiles[i][j].shift = 0;
        } else {
          this.tiles[i][j].shift = shift;
        }
      }
    }
  }

  shiftTiles() {
    for (let i = 0; i < this.columns; i++) {
      for (let j = this.rows-1; j >= 0; j--) {
        if (this.tiles[i][j].type == -1) {
          this.tiles[i][j].type = this.getRandomTile();
        } else {
          let shift = this.tiles[i][j].shift;
          if (shift > 0) {
              this.swap(i, j, i, j+shift)
          }
        }
        this.tiles[i][j].shift = 0;
      }
    }
  }

  renderTiles() {
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        let shift = this.tiles[i][j].shift;
        let tile = this.getTileCoords(i, j, 0, (this.game.animationTime / this.game.animationTimetotal) * shift);

        if (this.tiles[i][j].type >= 0) {
          this.renderTile(tile.x, tile.y, this.tiles[i][j].type);
        }
      }
    }

    if (this.game.gamestate == this.game.gamestates.resolve && (this.game.animationState == 2 || this.game.animationState == 3)) {
      let shiftX = this.game.currentMove.fromCol - this.game.currentMove.toCol;
      let shiftY = this.game.currentMove.fromRow - this.game.currentMove.toRow;

      let tile1 = this.getTileCoords(this.game.currentMove.toCol, this.game.currentMove.toRow, 0, 0);
      let tile1Shift = this.getTileCoords(this.game.currentMove.toCol, this.game.currentMove.toRow, (this.game.animationTime / this.game.animationTimetotal) * shiftX, (this.game.animationTime / this.game.animationTimetotal) * shiftY);
      let type1 = this.tiles[this.game.currentMove.toCol][this.game.currentMove.toRow].type;

      let tile2 = this.getTileCoords(this.game.currentMove.fromCol, this.game.currentMove.fromRow, 0, 0);
      let tile2Shift = this.getTileCoords(this.game.currentMove.fromCol, this.game.currentMove.fromRow, (this.game.animationTime / this.game.animationTimetotal) * -shiftX, (this.game.animationTime / this.game.animationTimetotal) * -shiftY);
      let type2 = this.tiles[this.game.currentMove.fromCol][this.game.currentMove.fromRow].type;

      this.renderTile(tile1.x, tile1.y, -9);
      this.renderTile(tile2.x, tile2.y, -9);

      if (this.game.animationState == 2) {
        this.renderTile(tile1Shift.x, tile1Shift.y, type1);
        this.renderTile(tile2Shift.x, tile2Shift.y, type2);
      } else {
        this.renderTile(tile2Shift.x, tile2Shift.y, type2);
        this.renderTile(tile1Shift.x, tile1Shift.y, type1);
      }
    }
  }

  getTileCoords(col, row, coloffset, rowoffset) {
    let x = this.x + (col + coloffset) * this.tilewidth;
    let y = this.y + (row + rowoffset) * this.tileheight;
    return { x: x, y: y};
  }

  renderTile(x, y, type) {
    let gem = this.colors[type];

    if (type === -9){
      this.context.fillStyle = "#7fbfe2";
      this.context.fillRect(x + 2, y + 2, this.tilewidth - 4, this.tileheight - 4);
    } else {
      this.context.drawImage(gem, x, y, this.tilewidth, this.tileheight);
    }
  }

  renderMoves() {
    for (let i = 0; i < this.moves.length; i++) {
      let tile1 = this.getTileCoords(this.moves[i].toCol, this.moves[i].toRow, 0, 0);
      let tile2 = this.getTileCoords(this.moves[i].fromCol, this.moves[i].fromRow, 0, 0);

      this.context.strokeStyle = "#ff0000";
      this.context.beginPath();
      this.context.moveTo(tile1.x + this.tilewidth/2, tile1.y + this.tileheight/2);
      this.context.lineTo(tile2.x + this.tilewidth/2, tile2.y + this.tileheight/2);
      this.context.stroke();
    }
  }

  swap(x1, y1, x2, y2) {
    let typeswap = this.tiles[x1][y1].type;
    this.tiles[x1][y1].type = this.tiles[x2][y2].type;
    this.tiles[x2][y2].type = typeswap;
  }
}

module.exports = Board;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(0);

class Game {
  constructor(context) {
    this.lastTime = 0;
    this.drag = false;
    this.gamestates = { init: 0, ready: 1, resolve: 2 };
    this.gamestate = this.gamestates.init;
    this.showmoves = false;
    this.gameover = false;
    this.buttons = [ { x: 30, y: 240, width: 150, height: 50, text: "New Game"},
                     { x: 30, y: 300, width: 150, height: 50, text: "Enable AI"}];
                    // { x: 30, y: 360, width: 150, height: 50, text: "About"}];
    this.animationTime = 0;
    this.animationState = 0;
    this.animationTimetotal = 0.3;
    this.ai = false;
    this.score = 0;
    this.context = context;
    this.board = new Board(this.context, this);
    this.mousetarget = { valid: false, x: 0, y: 0 };
    this.currentMove = { toCol: 0, toRow: 0, fromCol: 0, fromRow: 0 };
    this.setup();
  }

  setup() {
    canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    canvas.addEventListener("mouseout", this.onMouseOut.bind(this));

    this.board.createNew();

    this.newGame();
  }

  start(time) {
    this.update(time);
    this.render();
    window.requestAnimationFrame(this.start.bind(this));
  }

  update(time) {
    const timeDelta = (time - this.lastTime) / 1000;
    this.lastTime = time;

    if (this.gamestate == this.gamestates.ready) {
      if (this.board.moves.length <= 0) {
        this.gameover = true;
      }

      if (this.ai) {
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
    } else if (this.gamestate == this.gamestates.resolve) {
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
            this.gamestate = this.gamestates.ready;
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
            this.gamestate = this.gamestates.ready;
          }
        }
      } else if (this.animationState == 2) {
        if (this.animationTime > this.animationTimetotal) {
          this.board.swap(this.currentMove.toCol, this.currentMove.toRow, this.currentMove.fromCol, this.currentMove.fromRow);
          this.board.findMatches();

          if (this.board.matches.length > 0) {
            this.animationState = 0;
            this.animationTime = 0;
            this.gamestate = this.gamestates.resolve;
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

          this.gamestate = this.gamestates.ready;
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
    this.context.fillStyle = "#000000";
    this.context.fillRect(60,this.board.y+13,89,64);
    this.context.fillStyle = "#7fbfe2";
    this.context.fillRect(62,this.board.y+15,85,60);
    this.context.fillStyle = "#000000";
    this.context.font = "24px Verdana";
    this.renderText("Score:", 30, this.board.y+40, 150);
    this.renderText(this.score, 30, this.board.y+70, 150);

    this.renderButtons();

    let boardwidth = this.board.columns * this.board.tilewidth;
    let boardheight = this.board.rows * this.board.tileheight;

    this.context.fillStyle = "#000000";
    this.context.fillRect(this.board.x - 6, this.board.y - 6, boardwidth + 12, boardheight + 12);
    this.context.fillStyle = "#7fbfe2";
    this.context.fillRect(this.board.x - 4, this.board.y - 4, boardwidth + 8, boardheight + 8);

    this.board.renderTiles();

    if (this.showmoves && this.board.matches.length <= 0 && this.gamestate == this.gamestates.ready) {
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

  renderButtons() {
    for (let i = 0; i < this.buttons.length; i++) {
      this.context.fillStyle = "#000000";
      this.context.fillRect(this.buttons[i].x - 2, this.buttons[i].y - 2, this.buttons[i].width + 4, this.buttons[i].height + 4);
      this.context.fillStyle = "#85b1f7";
      this.context.fillRect(this.buttons[i].x, this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);

      this.context.fillStyle = "#ffffff";
      this.context.font = "18px Verdana";
      let textdim = this.context.measureText(this.buttons[i].text);
      this.context.fillText(this.buttons[i].text, this.buttons[i].x + (this.buttons[i].width-textdim.width)/2, this.buttons[i].y+30);
    }
  }

  newGame() {
    this.score = 0;

    this.gamestate = this.gamestates.ready;
    this.gameover = false;

    this.board.randomize();
    this.board.findMoves();
    this.board.findMatches();
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
    this.gamestate = this.gamestates.resolve;
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

    if (!this.drag) {
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


    for (let i = 0; i < this.buttons.length; i++) {
      if (pos.x >= this.buttons[i].x && pos.x < this.buttons[i].x + this.buttons[i].width &&
          pos.y >= this.buttons[i].y && pos.y < this.buttons[i].y + this.buttons[i].height) {
        if (i == 0) {
          this.newGame();
        } else if (i == 1) {
          this.ai = !this.ai;
          this.buttons[i].text = (this.ai?"Disable":"Enable") + " AI";
        } else if (i == 2) {
          // for about button
        }
      }
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);
const Board = __webpack_require__(0);

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("canvas");

  const ctx = canvasEl.getContext("2d");
  const game = new Game(ctx);
  game.start(0);
  // const board = new Board(ctx);

  // const game = new Game();
  // new GameView(game, ctx).start();
})


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map