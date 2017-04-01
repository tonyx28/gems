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
    red.src = "https://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/red_yrl9n3.png";
    red.crossOrigin = 'anonymous';
    const green = new Image();
    green.src = "https://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/green_kjadgp.png";
    green.crossOrigin = 'anonymous';
    const blue = new Image();
    blue.src = "https://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/blue_hmzor9.png";
    blue.crossOrigin = 'anonymous';
    const white = new Image();
    white.src = "https://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/white_nbuppm.png";
    white.crossOrigin = 'anonymous';
    const purple = new Image();
    purple.src = "https://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/purple_pzs9kv.png";
    purple.crossOrigin = 'anonymous';
    const yellow = new Image();
    yellow.src = "https://res.cloudinary.com/dogzxn5h4/image/upload/v1490979047/images/yellow_g98763.png";
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
