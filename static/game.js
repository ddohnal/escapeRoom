var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config)

var text;
var question = 'ahoj';


function collectStar(player, star) {

    this.socket.emit('test', 'ahoj');
    star.disableBody(true, true);
    star.enableBody(true, Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), true, true);
    text.setText('Question: ' + question)
}


function preload() {
    this.load.image('star', 'static/assets/star.png')
    this.load.spritesheet('dude', 'static/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create() {

    var self = this
    this.socket = io()

    player = this.physics.add.sprite(100, 450, 'dude');
    star = this.physics.add.image(500, 300, 'star');

    text = this.add.text(16, 16, 'Question', { fontSize: '32px', fill: '#000' });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

}



function update() {

    this.physics.add.overlap(player, star, collectStar, null, this);
    player.setCollideWorldBounds(true);

    var leftKey = this.input.keyboard.addKey('A');
    var rightKey = this.input.keyboard.addKey('D');
    var upKey = this.input.keyboard.addKey('W');
    var downKey = this.input.keyboard.addKey('S');

    var moving = false;

    const playerVelocity = 1;


    if (leftKey.isDown) {
        player.x -= playerVelocity;
        moving = true;
        player.anims.play('left', true);
    }
    if (rightKey.isDown) {
        player.x += playerVelocity;
        moving = true;
        player.anims.play('right', true);
    }
    if (upKey.isDown) {
        player.y -= playerVelocity;
        moving = true;
        player.anims.play('up', true);
    }
    if (downKey.isDown) {
        player.y += playerVelocity;
        moving = true;
        player.anims.play('down', true);
    }
    if (!moving) {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn');
    }
}




