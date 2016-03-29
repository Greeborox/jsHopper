
var loadState = {
  preload: function() {
    var loadingText = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#FFF' });
    loadingText.anchor.setTo(0.5, 0.5);
    game.load.image('splash', 'GFX/splashScreen.png');
    game.load.image('background', 'GFX/BG.png');
    game.load.image('bunny', 'GFX/bunny.png');
    game.load.image('car1', 'GFX/car1.png');
    game.load.image('car2', 'GFX/car2.png');
    game.load.image('truck', 'GFX/truck.png');
    game.load.image('car1F', 'GFX/car1F.png');
    game.load.image('car2F', 'GFX/car2F.png');
    game.load.image('truckF', 'GFX/truckF.png');
    game.load.image('logx3', 'GFX/logx3.png');
    game.load.image('logx5', 'GFX/logx5.png');
    game.load.image('logFix', 'GFX/logFix.png');
  },
  create: function() {
    game.state.start('menu');
  },
  update: function() {

  }
}

var menuState = {
  create: function() {
    game.add.image(0, 0, 'splash');
    style = {font: '25px Arial', fill: '#ffffff'};
    this.welcomeText = game.add.text(15, -50, 'Welcome to the game! \npress Space!',style)

    var welcomeTween = game.add.tween(this.welcomeText);
    welcomeTween.to({y: 160}, 700).easing(Phaser.Easing.Bounce.Out);
    welcomeTween.start();
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.addOnce(this.startGame, this);
  },
  startGame: function() {
    game.state.start('game');
  }
}

var gameState = {
  rows: [],
  baskets: [],
  tileSize: 32,
  leftPressed: false,
  rightPressed: false,
  upPressed: false,
  downPressed: false,
  onLog: true,
  score: 0,
  carSpeed: 70,
  logSpeed: 60,
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
      }
    }
    if(this.player.y>this.rows[2]&&this.player.y<this.rows[8]&&!this.onLog){
      this.bunnyDie();
    }
  },
  checkIfOnLog: function(){
    this.onLog = true;
    for(var i = 0; i < this.logs.children.length; i++) {
      var log = this.logs.children[i];
      var boundsA = log.getBounds();
      var boundsB = this.player.getBounds();
      if(Phaser.Rectangle.intersects(boundsA, boundsB)){
        break;
      }
      if(i === this.logs.children.length-1) {
        this.onLog = false;
      }
    }
  },
  resetBunny: function(){
    this.player.x = 0+this.tileSize/2;
    this.player.y = this.rows[this.rows.length-1]+this.tileSize/2;
  },
  setUpCars: function(){
    this.cars = game.add.group();
    this.cars.enableBody = true;
    game.add.sprite(90, this.rows[this.rows.length-2], 'car1F', 0, this.cars);
    game.add.sprite(270, this.rows[this.rows.length-2], 'car1F', 0, this.cars);
    game.add.sprite(20, this.rows[this.rows.length-3], 'truck', 0, this.cars);
    game.add.sprite(250, this.rows[this.rows.length-3], 'truck', 0, this.cars);
    game.add.sprite(50, this.rows[this.rows.length-4], 'car2F', 0, this.cars);
    game.add.sprite(150, this.rows[this.rows.length-4], 'car2F', 0, this.cars);
    game.add.sprite(320, this.rows[this.rows.length-4], 'car2F', 0, this.cars);
    game.add.sprite(120, this.rows[this.rows.length-5], 'car1', 0, this.cars);
    game.add.sprite(270, this.rows[this.rows.length-5], 'car1', 0, this.cars);
    game.add.sprite(20, this.rows[this.rows.length-6], 'truckF', 0, this.cars);
    game.add.sprite(200, this.rows[this.rows.length-6], 'truckF', 0, this.cars);
    game.add.sprite(50, this.rows[this.rows.length-7], 'car2', 0, this.cars);
    game.add.sprite(320, this.rows[this.rows.length-7], 'car2', 0, this.cars);
    for(var i = 0; i < this.cars.children.length; i++) {
      if((this.cars.children[i].y/32)%2 === 0 ){
        this.cars.children[i].body.velocity.x = -this.carSpeed;
      } else {
        this.cars.children[i].body.velocity.x = this.carSpeed;
      }
      this.cars.children[i].checkWorldBounds = true;
      this.cars.children[i].outOfBoundsKill = true;
    }
  },
  checkCars: function(){
    var car = this.cars.getFirstDead();
    if(!car){
      return
    }
    var y = car.y
    var width = car.width
    if((y/32)%2 === 0 ){
      car.reset(game.world.width, y);
      car.body.velocity.x = -this.carSpeed;
    } else {
      car.reset(0-width, y);
      car.body.velocity.x = this.carSpeed;
    }
    car.checkWorldBounds = true;
    car.outOfBoundsKill = true;
  },
  setUpLogs: function(){
    this.logs = game.add.group();
    this.logs.enableBody = true;
    game.add.sprite(0, this.rows[this.rows.length-9]+1, 'logx5', 0, this.logs);
    game.add.sprite(150, this.rows[this.rows.length-9]+1, 'logx5', 0, this.logs);
    game.add.sprite(300, this.rows[this.rows.length-9]+1, 'logx5', 0, this.logs);
    game.add.sprite(400, this.rows[this.rows.length-9]+1, 'logx5', 0, this.logs);
    game.add.sprite(-10, this.rows[this.rows.length-10]+2, 'logx3', 0, this.logs);
    game.add.sprite(120, this.rows[this.rows.length-10]+2, 'logx3', 0, this.logs);
    game.add.sprite(280, this.rows[this.rows.length-10]+2, 'logx3', 0, this.logs);
    game.add.sprite(200, this.rows[this.rows.length-11]+1, 'logx5', 0, this.logs);
    game.add.sprite(30, this.rows[this.rows.length-12]+2, 'logx5', 0, this.logs);
    game.add.sprite(20, this.rows[this.rows.length-13]+1, 'logx3', 0, this.logs);
    game.add.sprite(200, this.rows[this.rows.length-13]+1, 'logx3', 0, this.logs);
    game.add.sprite(80, this.rows[this.rows.length-14]+2, 'logx3', 0, this.logs);
    game.add.sprite(220, this.rows[this.rows.length-14]+2, 'logx3', 0, this.logs);
    game.add.sprite(30, this.rows[this.rows.length-15]+1, 'logx5', 0, this.logs);
    for(var i = 0; i < this.logs.children.length; i++) {
      if(this.logs.children[i].y%2 === 0 ){
        this.logs.children[i].body.velocity.x = -this.logSpeed;
      } else {
        this.logs.children[i].body.velocity.x = this.logSpeed;
      }
      this.logs.children[i].checkWorldBounds = true;
      this.logs.children[i].outOfBoundsKill = true;
    }
  },
  checkLogs: function(){
    var log = this.logs.getFirstDead();
    if(!log){
      return
    }
    var y = log.y
    var width = log.width
    if(y%2 === 0 ){
      log.reset(game.world.width, y);
      log.body.velocity.x = -this.logSpeed;
    } else {
      log.reset(0-width, y);
      log.body.velocity.x = this.logSpeed;
    }
    log.checkWorldBounds = true;
    log.outOfBoundsKill = true;
  },
  bunnyDie: function(){
    this.resetBunny();
    this.player.kill();
    style = {font: '25px Arial', fill: '#ffffff'};
    this.ohNo = game.add.text(game.world.centerX, -50, 'OH NO!',style);
    this.ohNo.anchor.setTo(0.5);
    this.dieText = game.add.text(game.world.centerX, -50, 'You have died!',style);
    this.dieText.anchor.setTo(0.5);
    var ohNoTween = game.add.tween(this.ohNo);
    ohNoTween.to({y: 160}, 1000).easing(Phaser.Easing.Bounce.Out);
    ohNoTween.start();
    ohNoTween.onComplete.add(function(){
      this.ohNo.kill();
      var dieTextTween = game.add.tween(this.dieText);
      dieTextTween.to({y: 160}, 1000).easing(Phaser.Easing.Bounce.Out);
      dieTextTween.start();
      dieTextTween.onComplete.add(function(){
        game.state.start('menu');
      },this)
    },this)
  },
  create: function() {
    this.baskets = [32,128,224,320];
    this.rows = [];
    this.score = 0;
    rowNum = game.height/this.tileSize;
    for(var i = 0;i<rowNum;i++){
      this.rows.push(this.tileSize*i);
    };
    game.add.tileSprite(0, 0, 384, 544, 'background');
    this.setUpLogs();
    game.add.tileSprite(0, this.rows[8], 384, 32, 'logFix');
    this.player = game.add.sprite(0+this.tileSize/2,this.rows[this.rows.length-1]+this.tileSize/2,'bunny');
    this.player.anchor.setTo(0.5);
    this.setUpCars();
    this.keys = game.input.keyboard.createCursorKeys();
    game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds=true;
  },
  update: function() {
    this.bunnyHop();
    this.checkIfOnLog();
    this.checkBunny();
    this.bunnyUpdate();
    this.checkCars();
    this.checkLogs();
    game.physics.arcade.overlap(this.player, this.cars, this.bunnyDie, null, this);
    if(this.score === 4){
      this.score++;
      this.resetBunny();
      this.player.kill();
      style = {font: '25px Arial', fill: '#ffffff'};
      this.gratsText = game.add.text(game.world.centerX, -50, 'Congratulations!',style);
      this.gratsText.anchor.setTo(0.5);
      var gratsTween = game.add.tween(this.gratsText);
      gratsTween.to({y: 160}, 1000).easing(Phaser.Easing.Bounce.Out);
      gratsTween.start();
      gratsTween.onComplete.add(function(){
        game.state.start('menu');
      },false)
    }
  }
};

var game = new Phaser.Game(384, 544, Phaser.AUTO, 'game');

game.state.add('load', loadState)
game.state.add('menu', menuState)
game.state.add('game', gameState);
game.state.start('load');
