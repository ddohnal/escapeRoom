const levelsConfig = [
    //level one
    {
        levelID: 1,
        //array of chests positions
        chests: [
            { x: 250, y: 150, id: 1 },
            { x: 400, y: 150, id: 2 },
            { x: 550, y: 150, id: 3 }
        ]
    },

    //level two
    {
        levelID: 2,
        //array of chests positions
        chests: [
            { x: 250, y: 200, id: 1 },
            { x: 300, y: 200, id: 2 },
            { x: 350, y: 200, id: 3 }
        ]
    },
    //level three
    {
        levelID: 3,
        //array of chests positions
        chests: [
            { x: 250, y: 250, id: 1 },
            { x: 300, y: 250, id: 2 },
            { x: 350, y: 250, id: 3 }
        ]
    },
];

class playGame extends Phaser.Scene {
    constructor() {
        super('playGame');

        this.player;
        this.question;
        this.stars;
    }

    create() {
        this.socket = io()
        // Player sprite
        this.player = this.physics.add.sprite(450, 450, 'boy');
        //Resize bounding box
        this.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: false })




        // Overlap sprite
        this.isWithin = this.physics.add.sprite(100, 450);
        this.isWithin.displayWidth = 60 * 1.2;
        this.isWithin.displayHeight = 65 * 1.5;

        // information text in the upper left corner
        this.style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.movementText = this.add.text(0, 0, "Movement keys: W,A,S,D", this.style);
        this.interactText = this.add.text(0, 50, "Interact key: F", this.style)
        this.movementText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.interactText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        this.chests = []
        for (let starPos of levelsConfig[0].chests) {
            this.chest = this.physics.add.image(starPos.x, starPos.y, 'chest')
            this.chest.id = starPos.id
            this.chest.setScale(2);
            this.chest.setImmovable();
            this.chests.push(this.chest);
        }

        // console.log(this.stars);

        // Keybinding
        this.leftKey = this.input.keyboard.addKey('A');
        this.rightKey = this.input.keyboard.addKey('D');
        this.upKey = this.input.keyboard.addKey('W');
        this.downKey = this.input.keyboard.addKey('S');
        this.interactKey = this.input.keyboard.addKey('F');

        // Boy animation
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('boy', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('boy', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('boy', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('boy', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downRight',
            frames: this.anims.generateFrameNumbers('boy', { start: 16, end: 19 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'downLeft',
            frames: this.anims.generateFrameNumbers('boy', { start: 20, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'upLeft',
            frames: this.anims.generateFrameNumbers('boy', { start: 24, end: 27 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'upRight',
            frames: this.anims.generateFrameNumbers('boy', { start: 28, end: 31 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'stop',
            frames: [{ key: 'boy', frame: 0 }],
            frameRate: 10
        });
    }

    update() {
        // Player collider with stars
        this.physics.add.collider(this.player, this.chests);

        // Invisible sprite overlap with stars
        this.physics.add.overlap(this.isWithin, this.chests, this.showQuestion, null, this);

        this.player.setCollideWorldBounds(true);

        // Reset player movement if no keybind is pressed
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        // Copying the player's movement
        this.isWithin.x = this.player.x;
        this.isWithin.y = this.player.y;

        // Left and right movement
        if (this.leftKey.isDown) {
            if (this.upKey.isDown) {
                this.player.setVelocityX(-160);
                this.player.setVelocityY(-160);
                this.player.anims.play('upLeft', true);
            }
            else if (this.downKey.isDown) {
                this.player.setVelocityX(-160);
                this.player.setVelocityY(160);
                this.player.anims.play('downLeft', true);
            } else {
                this.player.setVelocityX(-160)
                this.player.anims.play('left', true);
            }

        } else if (this.rightKey.isDown) {
            if (this.upKey.isDown) {
                this.player.setVelocityX(160);
                this.player.setVelocityY(-160);
                this.player.anims.play('upRight', true);
            }
            else if (this.downKey.isDown) {
                this.player.setVelocityX(160);
                this.player.setVelocityY(160);
                this.player.anims.play('downRight', true);
            } else {
                this.player.setVelocityX(160)
                this.player.anims.play('right', true);
            }
        } else {
            this.player.setVelocityX(0);
        }

        if (this.upKey.isDown && !(this.rightKey.isDown || this.leftKey.isDown)) {
            this.player.setVelocityY(-160);
            this.player.anims.play('up', true);
        }
        if (this.downKey.isDown && !(this.rightKey.isDown || this.leftKey.isDown)) {
            this.player.setVelocityY(160);
            this.player.anims.play('down', true);
        }
        if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0) {
            this.player.anims.play('stop', true);
        }
    }

    showQuestion(player, chest) {
        // Invisible sprite overlap with star, F key need to be pressed to continue interaction
        if (this.interactKey.isDown) {
            var scene = this;
            var socket = this.socket;

            console.log(chest.id);
            console.log(chest.x, chest.y);

            socket.emit('getQuestion', chest.id);

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
                    // console.log(answer.value);
                    socket.emit('answer', answer.value);

                    //  Have they entered anything?
                    if (answer.value !== '' && answer.value !== '') {
                        //  Turn off the click events
                        this.removeListener("click");
                        // this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });
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
        }
    }

    disableInput() {
        // Disable player movement input
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

        this.input.keyboard.removeCapture(this.interactKey.keyCode);
        this.interactKey.reset();
        this.interactKey.enabled = false;
    }

    enableInput() {
        // Enable player movement input
        this.input.keyboard.addCapture(this.leftKey.keyCode);
        this.leftKey.enabled = true;

        this.input.keyboard.addCapture(this.rightKey.keyCode);
        this.rightKey.enabled = true;

        this.input.keyboard.addCapture(this.upKey.keyCode);
        this.upKey.enabled = true;

        this.input.keyboard.addCapture(this.downKey.keyCode);
        this.downKey.enabled = true;

        this.input.keyboard.removeCapture(this.interactKey.keyCode);
        this.interactKey.enabled = true;
    }
    delayDone() {
        this.player.body.setSize(this.player.width * 0.6, this.player.height, true);
    }
}