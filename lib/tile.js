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

class Tile {
  constructor() {
    x = 0;
    y = 0;
    shift = 0;
    width: 40;
    height: 40;
    type = getRandom();
    this.colors = [red, green, blue, white, purple, yellow];
  }

  getRandom() {
    return Math.floor(Math.random() * this.colors.length);
  }
}
