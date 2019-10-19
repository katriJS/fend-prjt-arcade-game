const canvas = document.querySelector('canvas');
const playerModal = document.getElementById('playerModal');
const gameOverModal = document.getElementById('gameoverModal');

const sprites = {
        'boy': 'images/char-boy.png',
        'horn girl': 'images/char-horn-girl.png',
        'cat girl': 'images/char-cat-girl.png',
        'princess girl': 'images/char-princess-girl.png'
    };

const SCREEN_WIDTH = 400;
let GAME_START =  false;

/**
* @description constructor for all basic game assets. Player and Enemy objects
*              inherit from this class
* @constructor
* @param {int} x - starting x position on the destination canvas
* @param {int} y - starting y position on the destination canvas
* @param {int} w - width of the asset. May differ from actual dimensions
* @param {int} h - height of the asset. May differ from actual dimensions
* @param {int} src - source of the asset image.
*/
const Asset = function(x, y, w, h, src) {
  // The image/sprite for assets, this uses
  // a helper provided to easily load images
    this.sprite = src;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.start_position = {x: this.x, y: this.y};
};

// Draw the asset on the screen, required method for game
Asset.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// reposition the asset to its original position
Asset.prototype.reset = function() {

  this.x = this.start_position.x;
  this.y = this.start_position.y;
};

// Detect if a collision occur with the given sprite
Asset.prototype.collisionDetected = function(sprite) {
  let x_min = this.x - this.width;
  let x_max = this.x + this.width;
  let y_min = this.y - this.height;
  let y_max = this.y + this.height;

  if(sprite.x > x_min && sprite.x <= x_max &&
     sprite.y > y_min && sprite.y <= y_max) {
       console.log(Math.floor(x_min),' < p-x: ',sprite.x,' < ',Math.floor(x_max));
       console.log(Math.floor(y_min),' < p-y: ',sprite.y,' < ',Math.floor(y_max));
       return true;
  }
    return false;
};

/**
* @description Enemies our player must avoid
* @constructor
* inherits from Asset
*/
function Enemy(x, y, w, h, src)  {
    //call the supertype constructor
    Asset.call(this, x, y, w, h, src);
    this.speed = 100;
}

Enemy.prototype = Object.create(Asset.prototype, {
                  constructor: {
                      configurable: true,
                      enumerable: true,
                      value: Enemy,
                      writable: true
                  }
});

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, player) {
    // Multiply any movement by the dt parameter to ensure the
    // game runs at the same speed for all computers.
    if(GAME_START) {

      this.x += this.speed * dt;
      if(this.x > SCREEN_WIDTH){
        this.x = -100; //off screen
        this.speed = 50 + Math.floor(Math.random() * 201);
      }

      if(this.collisionDetected(player)) {
        player.hit = true;
      }
    }

};



/**
* @description Player class. This class requires an update(), render() and
*              a handleInput() method.
* @constructor
* Inherits from Asset
*/
function Player (x, y, w, h, src) {
    //call the supertype constructor
    Asset.call(this, x, y, w, h, src);
    this.hit = false;
}

Player.prototype = Object.create(Asset.prototype, {
                  constructor: {
                      configurable: true,
                      enumerable: true,
                      value: Player,
                      writable: true
                  }
});

//Choose a player
Player.prototype.switch = function(selection, sprites) {
  switch (selection) {
    case 'next':
      let spriteKeys = Object.values(sprites);
      let currentIndex = spriteKeys.indexOf(this.sprite);
      nextSprite = currentIndex == spriteKeys.length-1 ? 0 : currentIndex+1;
      this.sprite = spriteKeys[nextSprite];
      break;

    default:
      this.sprite = sprites[selection.alt];
      break;
  }
};

// Update player's position, required method for game
Player.prototype.update = function() {
  if (this.hit) {
    //feedback("You Lose!");
    this.reset();
    //GAME_START = false;
  }
  else {
    if(this.y < 0) {
        feedback("You Win!");
        this.reset();
        GAME_START = false;
    }
  }

};


Player.prototype.reset = function() {
  Asset.prototype.reset.call(this);
  this.hit = false;
};

Player.prototype.handleInput = function(value) {

    switch (value) {
      case 'up':
          this.y = this.y > 0  ? this.y-90 : this.y;
          if(this.y < 0) this.y = -10;
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
          if(this.collisionDetected(selector)){
            this.switch('next', sprites);
          }
        break;

    }

};





// Instantiate all objects.
const player = new Player(200, 400, 50, 85, 'images/char-boy.png');

const allEnemies = [new Enemy(10, 65, 70, 60, 'images/enemy-bug.png'),
                    new Enemy(10, 150, 70, 60, 'images/enemy-bug.png'),
                    new Enemy(10, 230, 70, 60, 'images/enemy-bug.png')];

const selector = new Asset(200, 400, 50, 42, 'images/Selector.png');
let button = playerModal.querySelector('button');
button.focus();



/**
* @description handled input for player selection
* @constructor
* @param {string/element} selection - 'default' string or doc element/sprite
*/
function selectPlayer(selection) {
  GAME_START = true;


  if(selection === 'default') {
    selection = document.getElementById('default');
  }

  player.switch(selection, sprites);

  //Hide modal
  playerModal.style.display = 'none';

}

/**
* @description Win or Lose Modal feedback
* @param {'string'} m - the message to display in Modal
*/
function feedback(msg) {

  let message = gameOverModal.querySelector('h2');
  let button = gameOverModal.querySelector('button');
  message.textContent = msg;

  canvas.style.filter = 'blur(5px)';
  gameOverModal.style.display = 'flex';
  button.focus();

}


/**
* @description Reset Game
*
*/
function resetGame() {
  allEnemies.forEach(function(enemy) {
      enemy.reset();
  });
  player.reset();
  canvas.style.filter = 'unset';
  gameOverModal.style.display = 'none';
  GAME_START = true;
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

    if(GAME_START)
      player.handleInput(allowedKeys[e.keyCode]);

});

window.onclick = function(event) {
 if (event.target == playerModal) {
   selectPlayer('default');
 }
};
