const tilecolors = [[255, 128, 128],
                  [128, 255, 128],
                  [128, 128, 255],
                  [255, 255, 128],
                  [255, 128, 255],
                  [128, 255, 255],
                  [255, 255, 255]];
class Tile {
  constructor() {
    x = 0;
    y = 0;
    color ||= getRandomColor();
    width: 40;
    height: 40;
  }

  getRandomColor() {
    return tilecolors[Math.floor(Math.random() * tilecolors.length)];
  }
}
