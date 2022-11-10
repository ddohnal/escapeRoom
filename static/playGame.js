class playGame extends Phaser.Scene {
    constructor() {
        super('PlayGame');

        this.player;
        this.question;
    }

    preload() {
        this.load.image('star', 'static/assets/star.png')
        this.load.spritesheet('dude', 'static/assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        var self = this
        this.socket = io()

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.star1 = this.physics.add.image(500, 300, 'star');
        this.star1.id = 1;

        this.text = this.add.text(16, 16, 'Question', { fontSize: '32px', fill: '#000' });

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

    update() {

        this.physics.add.overlap(this.player, this.star1, this.collectStar, null, this);
        this.player.setCollideWorldBounds(true);

        var leftKey = this.input.keyboard.addKey('A');
        var rightKey = this.input.keyboard.addKey('D');
        var upKey = this.input.keyboard.addKey('W');
        var downKey = this.input.keyboard.addKey('S');

        var moving = false;

        const playerVelocity = 2;


        if (leftKey.isDown) {
            this.player.x -= playerVelocity;
            moving = true;
            this.player.anims.play('left', true);
        }
        if (rightKey.isDown) {
            this.player.x += playerVelocity;
            moving = true;
            this.player.anims.play('right', true);
        }
        if (upKey.isDown) {
            this.player.y -= playerVelocity;
            moving = true;
            this.player.anims.play('up', true);
        }
        if (downKey.isDown) {
            this.player.y += playerVelocity;
            moving = true;
            this.player.anims.play('down', true);
        }
        if (!moving) {

            this.player.anims.play('turn');
        }
    }

    collectStar(player, star) {

        this.socket.emit('test', star.id);
        this.socket.on('test2', (arg) => {
            this.text.setText('Question: ' + arg);
            console.log(arg);

        })
        star.disableBody(true, true);
        // star.enableBody(true, Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), true, true);

    }
}