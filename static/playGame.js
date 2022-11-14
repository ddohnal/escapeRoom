class playGame extends Phaser.Scene {
    constructor() {
        super('playGame');

        this.player;
        this.question;
    }

    create() {
        this.socket = io()

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.star1 = this.physics.add.image(100, 300, 'star');
        this.star1.id = 1;

        this.leftKey = this.input.keyboard.addKey('A');
        this.rightKey = this.input.keyboard.addKey('D');
        this.upKey = this.input.keyboard.addKey('W');
        this.downKey = this.input.keyboard.addKey('S');

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

        var moving = false;

        const playerVelocity = 2;

       if (this.leftKey.isDown) {
           this.player.x -= playerVelocity;
           moving = true;
           this.player.anims.play('left', true);
       }

       if (this.rightKey.isDown) {
           this.player.x += playerVelocity;
           moving = true;
           this.player.anims.play('right', true);
       }

       if (this.upKey.isDown) {
           this.player.y -= playerVelocity;
           moving = true;
           this.player.anims.play('up', true);
       }

       if (this.downKey.isDown) {
           this.player.y += playerVelocity;
           moving = true;
           this.player.anims.play('down', true);
       }

        if (!moving) {
            this.player.anims.play('turn');
        }
    }

    collectStar(player, star) {
        var scene = this;
        var socket = this.socket;

        console.log(star.id);
        socket.emit('getQuestion', star.id);

        var element = this.add.dom(400, 600).createFromCache("form");
        element.setPerspective(800);
        element.addListener("click");

        scene.disableInput();

        socket.on('questionToAsk', (arg) => {
            document.getElementById('question').innerHTML = arg;
        });

        element.on("click", function (event) {
            if (event.target.name === "sendAnswer") {
                var answer = this.getChildByName("answer");
                console.log(answer.value);
                socket.emit('answer', answer.value);

                //  Have they entered anything?
                if (answer.value !== '' && answer.value !== '') {
                    //  Turn off the click events
                    this.removeListener("click");
                }
                socket.on('result', (arg) => {
                    if (arg) {
                        console.log('correct answer');
                    }
                    else {
                        console.log('wrong answer');
                    }

                    scene.enableInput();
                    element.destroy();
                })
            }

        });

        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: 'Power3'
        });

        star.disableBody(true, true);
        // star.enableBody(true, Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), true, true);
    }

    disableInput() {
        this.input.keyboard.removeCapture(this.leftKey.keyCode);
        this.leftKey.reset();
        this.leftKey.enabled = false;

        this.input.keyboard.removeCapture(this.rightKey.keyCode);
        this.rightKey.reset();
        this.rightKey.enabled = false;

        this.input.keyboard.removeCapture(this.upKey.keyCode);
        this.upKey.reset();
        this.upKey.enabled = false;

        this.input.keyboard.removeCapture(this.downKey.keyCode);
        this.downKey.reset();
        this.downKey.enabled = false;
    }

    enableInput() {
        this.input.keyboard.addCapture(this.leftKey.keyCode);
        this.leftKey.enabled = true;

        this.input.keyboard.addCapture(this.rightKey.keyCode);
        this.rightKey.enabled = true;

        this.input.keyboard.addCapture(this.upKey.keyCode);
        this.upKey.enabled = true;

        this.input.keyboard.addCapture(this.downKey.keyCode);
        this.downKey.enabled = true;
    }
}