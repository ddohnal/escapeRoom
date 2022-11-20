const levelsConfig = [
    //level one
    {
        levelID: 1,
        //array of stars positions
        stars: [
            { x: 250, y: 150, id: 1 },
            { x: 350, y: 150, id: 2 },
            { x: 450, y: 150, id: 3 }
        ]
    },

    //level two
    {
        levelID: 2,
        //array of stars positions
        stars: [
            { x: 250, y: 200, id: 1 },
            { x: 300, y: 200, id: 2 },
            { x: 350, y: 200, id: 3 }
        ]
    },
    //level three
    {
        levelID: 3,
        //array of stars positions
        stars: [
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
        this.player = this.physics.add.sprite(100, 450, 'dude');

        // Overlap sprite
        this.isWithin = this.physics.add.sprite(100, 450);
        this.isWithin.displayWidth = 32 * 1.5;
        this.isWithin.displayHeight = 48 * 1.5;

        // information text in the upper left corner
        this.style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.movementText = this.add.text(0, 0, "Movement keys: W,A,S,D", this.style);
        this.interactText = this.add.text(0, 50, "Interact key: F", this.style)
        this.movementText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.interactText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        this.stars = []
        for (let starPos of levelsConfig[0].stars) {
            this.star = this.physics.add.image(starPos.x, starPos.y, 'star')
            this.star.id = starPos.id
            this.star.setImmovable();
            this.stars.push(this.star);
        }

        // console.log(this.stars);

        // Keybinding
        this.leftKey = this.input.keyboard.addKey('A');
        this.rightKey = this.input.keyboard.addKey('D');
        this.upKey = this.input.keyboard.addKey('W');
        this.downKey = this.input.keyboard.addKey('S');
        this.interactKey = this.input.keyboard.addKey('F');

        // Animations
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
        // Player collider with stars
        this.physics.add.collider(this.player, this.stars);

        // Invisible sprite overlap with stars
        this.physics.add.overlap(this.isWithin, this.stars, this.collectStar, null, this);

        this.player.setCollideWorldBounds(true);

        // Reset player movement if no keybind is pressed
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);

        // Copying the player's movement
        this.isWithin.x = this.player.x;
        this.isWithin.y = this.player.y;

        // Left and right movement
        if (this.leftKey.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.rightKey.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
        }

        // Top and down movement
        if (this.upKey.isDown) {
            this.player.setVelocityY(-160);
            // this.player.anims.play('up', true);
        } else if (this.downKey.isDown) {
            this.player.setVelocityY(160);
            // this.player.anims.play('down', true);
        } else {
            this.player.setVelocityY(0);

        }
        if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0) {
            this.player.anims.play('turn', true);
        }
    }

    collectStar(player, star) {
        // Invisible sprite overlap with star, F key need to be pressed to continue interaction
        if (this.interactKey.isDown) {
            var scene = this;
            var socket = this.socket;

            console.log(star.id);
            console.log(star.x, star.y);

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
}