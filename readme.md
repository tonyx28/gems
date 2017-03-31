# Gem Collector
Gem Collector is simple matching puzzle game from the genre that has brought us hits like Bejeweled, Puzzle Quest, and Candy Crush Saga. It is coded in JavaScript and rendered using HTML5 Canvas.

![game][game]

## Features
- Game is rendered through canvas with an HTML background.
- Users can interact with gems using mouse clicks and mouse drag.
- Score counter tracks points earned by player.
- New Game button allows player to reset game.
- AI has been implemented for autoplay using brute force (see below).

```JavaScript
this.board.findMoves();

if (this.board.moves.length > 0) {
  let move = this.board.moves[Math.floor(Math.random() * this.board.moves.length)];

  this.swapTiles(move.toCol, move.toRow, move.fromCol, move.fromRow);
}
```

## Project Design
Gem Collector was built in 4 days.

A proposal was drafted to help provide an implementation timeline during the development process.

A [wireframe][wireframe] was prepared along with the design proposal.


## Technologies
Gem Collector is a puzzle game built on JavaScript and HTML5/Canvas. It uses JavaScript to handle the game logic and Canvas to render the tiles, board, score, and buttons. Mouse click event handlers are used to track process user interaction.

[game]: http://res.cloudinary.com/dogzxn5h4/image/upload/v1490985549/images/gem.png
[wireframe]: http://res.cloudinary.com/dogzxn5h4/image/upload/v1490984940/images/wireframe.png
