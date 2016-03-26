
var gameState = {
  rows: [],
  baskets: [],
  tileSize: 32,
  leftPressed: false,
  rightPressed: false,
  upPressed: false,
  downPressed: false,
  score: 0,
  bunnyHop: function() {
    if(this.keys.left.isDown && !this.leftPressed) {
      this.leftPressed = true;
      this.player.x -= this.tileSize;
      this.player.angle = -90;
    }
    if(this.keys.right.isDown && !this.rightPressed) {
      this.rightPressed = true;
      this.player.x += this.tileSize;
      this.player.angle = 90;
    }
    if(this.keys.up.isDown && !this.upPressed) {
      this.upPressed = true;
      this.player.y -= this.tileSize;
      this.player.angle = 0;
    }
    if(this.keys.down.isDown && !this.downPressed) {
      this.downPressed = true;
      this.player.y += this.tileSize;
      this.player.angle = 180;
    }
    if(!this.keys.left.isDown) {
      this.leftPressed = false;
    }
    if(!this.keys.right.isDown) {
      this.rightPressed = false;;
    }
    if(!this.keys.up.isDown) {
      this.upPressed = false;
    }
    if(!this.keys.down.isDown) {
      this.downPressed = false;
    }
  },
  bunnyUpdate: function(){
    if(this.player.y < 2*this.tileSize+this.tileSize/2){
      this.player.y = 2*this.tileSize+this.tileSize/2;
    }
  },
  checkBunny: function(){
    if(this.player.y<2*this.tileSize+this.tileSize/2){
      var index = this.baskets.indexOf(this.player.x-this.tileSize/2)
      if(index != -1){
        this.baskets[index] = false;
        var newBunny = game.add.sprite(this.player.x,this.player.y,'bunny');
        newBunny.anchor.setTo(0.5);
        newBunny.angle = 180;
        this.score++;
        this.resetBunny();
        console.log('score:',this.score);
      }
    }
  },
  resetBunny: function(){
    this.player.x = 0+this.tileSize/2;
    this.player.y = this.rows[this.rows.length-1]+this.tileSize/2;
  },
  preload: function() {
    game.load.image('background', 'GFX/BG.png');
    game.load.image('bunny', 'GFX/bunny.png');
    this.baskets = [32,128,224,320];
    this.rows = [];
    this.score = 0;
    rowNum = game.height/this.tileSize;
    for(var i = 0;i<rowNum;i++){
      this.rows.push(this.tileSize*i);
    };

  },
  create: function() {
    this.background = game.add.tileSprite(0, 0, 384, 544, 'background');
    this.player = game.add.sprite(0+this.tileSize/2,this.rows[this.rows.length-1]+this.tileSize/2,'bunny');
    this.player.anchor.setTo(0.5);
    this.keys = game.input.keyboard.createCursorKeys();
    game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds=true;
  },
  update: function() {
    this.bunnyHop();
    this.checkBunny();
    this.bunnyUpdate();
  }
};

var game = new Phaser.Game(384, 544, Phaser.AUTO, 'game');

game.state.add('game', gameState);
game.state.start('game');
