# Gem Collector

## Background

Gem Collector is simple match 3 game from the genre that has brought us hits like Bejeweled, Puzzle Quest, and Candy Crush Saga.


## Functionaility & MVP

In Gem Collector, users will be able to:

- [ ] Start, pause, resume, and quit the game
- [ ] Select a tile on click to be swapped with a neighboring tile

The game will:
- [ ] Generate the board randomly
- [ ] Keep score of collected gems

In addition, thsi project will include:
- [ ] A production Readme

## Wireframes

This app will be a single screen app with game board, game menu modal, and score board. On the right will be the game menu button and scoreboard. The gameboard will cover the middle and left side.

![wireframe](docs/gem_collector.png)
## Architecture and Technologies

The project will be implemented with the following technologies:

- Vanilla JavaScript will be used for the overall structure and game logic,
- HTML5 Canvas for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

## Implementation Timeline

**Day 1**: Setup all necessary modules. Create webpack.config.js and package.json. Write a basic entry file.

**Day 2**: Build a render of the board. It should randomize the tiles. Implement the interactive portion of the UI. Users should be able to move a tile around. Game menu should function: start, pause, resume, quit.

**Day 3**: Build the game logic. If 3 or more tiles match, they should be deleted and repopulated with random tiles. Implement the scoreboard to keep track of tiles cleared.

**Day 4**: Style the frontend. Choose a theme and skin the UI.
