const canvas = document.querySelector('canvas');
const sprites = {
        'boy': 'images/char-boy.png',
        'horn girl': 'images/char-horn-girl.png',
        'cat girl': 'images/char-cat-girl.png',
        'princess girl': 'images/char-princess-girl.png'
    };

/**
* @description Enemies our player must avoid
* @constructor
* @param {string} ? - ?
* @param {string} ? - ?
*/
const Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
/**
* @description Enemies our player must avoid
* @constructor
* @param {string} ? - ?
* @param {string} ? - ?
*/
const Player = function() {

    // The image/sprite for our player
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;


};

//Choose a player
Player.prototype.switch = function(selection, sprites) {
  switch (selection) {
    case 'next':
      let spriteKeys = Object.values(sprites);
      let currentIndex = spriteKeys.indexOf(this.sprite);
      nextSprite = currentIndex == spriteKeys.length-1 ? 0 : currentIndex+1;
      console.log(spriteKeys[nextSprite]);
      this.sprite = spriteKeys[nextSprite];
      break;

    default:
      this.sprite = sprites[selection.alt];
      console.log(sprites[selection.alt]);
      break;
  }
};

// Update player's position, required method for game
Player.prototype.update = function() {
  console.log('x: ',this.x,' y: ',this.y);
};

// Update player's position, required method for game
Player.prototype.collisionDetected = function(element) {
  console.log('here');
  console.log('element: x',element.x,' y: ',element.y);
  if(this.x === element.x && this.y === element.y){
    return true;
  }

};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(value) {
    console.log(value);


    switch (value) {
      case 'up':
          this.y = this.y > 0  ? this.y-90 : this.y;
        break;

      case 'down':
          this.y = this.y < 400  ? this.y+90 : this.y;
        break;

      case 'left':
          this.x = this.x > 30 ? this.x-100 : this.x;
        break;

      case 'right':
          this.x = this.x < 360 ? this.x+100 : this.x;
        break;

      case 'space':
          // TODO: if player position overlaps with selector change sprites
          if(this.collisionDetected(selector)){
            this.switch('next', sprites);
          }

        break;
      default:

    }

};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
/**
* @description Enemies our player must avoid
* @constructor
* @param {string} ? - ?
* @param {string} ? - ?
*/
const Item = function(x, y, src) {
    this.sprite = src;
    this.x = x;
    this.y = y;
};

// Draw the item on the screen, required method for game
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player();
const allEnemies = [];
const selector = new Item(200, 400, 'images/Selector.png');
const modal = document.querySelector('.modal');


function selectPlayer(selection) {
  if(selection === 'default') {
    selection = document.getElementById('default');
  }
  player.switch(selection, sprites);

  //Hide modal
  modal.style.display = 'none';

}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

window.onclick = function(event) {
 if (event.target == modal) {
   selectPlayer('default');
 }
};
