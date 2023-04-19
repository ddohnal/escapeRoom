class playGame extends Phaser.Scene {
    constructor() {
        super('playGame');

        this.player;
        this.timedEvent;

    }

    create() {
        this.socket = io()

        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.currentLevel = 1;
        this.score = 0;
        this.health = 3;

        this.gameOver = false;
        this.gameOverTime = 600;

        this.hint = "";
        this.hintX = 0;
        this.hintY = 0;

        this.timeLeft = this.gameOverTime;


        console.log(this.health);



        //tilesmap
        const map = this.make.tilemap({ key: "map", tileWidth: 30, tileHeight: 30 });

        const tileset = map.addTilesetImage("tiles1", "tiles");
        const propstileset = map.addTilesetImage("tiles2", "tiles_props")
        const decorativetileset = map.addTilesetImage("tiles3", "tiles_decorative")
        // const furnitureTileSet = map.addTilesetImage("tiles2", "propstileset");

        this.groundLayer = map.createLayer("Ground", tileset, 0, 0);
        this.groundLayer.setScale(1.75);

        this.wallsLayer = map.createLayer("Walls", tileset, 0, 0);
        this.wallsLayer.setScale(1.75);
        this.wallsLayer.setCollisionByProperty({ collides: true });

        this.propLayer = map.createLayer("Props", propstileset, 0, 0);
        this.propLayer.setScale(1.75);
        this.propLayer.setCollisionByProperty({ collides: true });

        this.decorativeLayer = map.createLayer("Decorative", decorativetileset, 0, 0);
        this.decorativeLayer.setScale(1.75);
        this.decorativeLayer.setCollisionByProperty({ collides: true });


        this.itemLayer = map.getObjectLayer("Items", 0, 0)['objects'];
        this.itemsGroup = this.physics.add.staticGroup()

        this.itemLayer.forEach(object => {
            let obj = this.itemsGroup.create(object.x * 1.75 + object.width, object.y * 1.75 - object.width, object.name).setData('id', object.properties[0].value);
            obj.setScale(1.75);
            let name = object.name;
            console.log(name + obj.getData('id'));
            obj.body.width = object.width;
            obj.body.height = object.height;
            obj.setPipeline('Light2D');
        })

        this.doorLayer = map.getObjectLayer("Doors", 0, 0)['objects'];
        this.doorsGroup = this.physics.add.staticGroup()

        this.doorLayer.forEach(object => {
            let obj = this.doorsGroup.create(object.x * 1.75 + object.width, object.y * 1.75 - object.width, object.name).setData('id', object.properties[1].value);
            obj.setScale(1.75);
            let name = object.name;
            console.log("name: " + name + " id: " + obj.getData('id'));
            obj.body.width = object.width;
            obj.body.height = object.height;
            obj.setPipeline('Light2D');
        })


        this.style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        //hp text
        this.hpText = this.add.text(0, 50, "HP: " + this.health, this.style);
        this.hpText.scrollFactorX = 0
        this.hpText.scrollFactorY = 0
        // information text in the upper left corner

        this.movementText = this.add.text(0, 100, "Movement keys: W,A,S,D", this.style);
        this.movementText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.movementText.scrollFactorX = 0
        this.movementText.scrollFactorY = 0


        this.interactText = this.add.text(0, 150, "Interact key: F", this.style)
        this.interactText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.interactText.scrollFactorX = 0
        this.interactText.scrollFactorY = 0

        this.hintText = this.add.text(100, 20, "Hint: " + this.hint, this.style);
        this.hintText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        //this.hintText.scrollFactorX = 0
        //this.hintText.scrollFactorY = 0
        this.hintText.setOrigin(0.5, 0.5);
        this.hintText.visible = false

        this.timerText = this.add.text(this.screenCenterX, 50, 'Time left: ' + this.timeLeft + 's', { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        this.timerText.setOrigin(0.5, 0.5);
        this.timerText.scrollFactorX = 0;
        this.timerText.scrollFactorY = 0;


        this.time.addEvent({
            delay: this.gameOverTime * 1000, // časový limit v milisekundách
            callback: this.endGame, // funkce, která se má spustit po uplynutí času
            callbackScope: this
        });

        this.time.addEvent({
            delay: 1000, // časový limit v milisekundách
            repeat: this.timeLeft - 1, // počet opakování
            callback: this.timerCounter,
            callbackScope: this
        });

        // player sprite        
        this.player = this.physics.add.sprite(550, 600, 'boy');
        this.player.setSize(20, 20);
        this.player.setOffset(22.5, 40);
        // resize bounding box
        this.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: false })

        // overlap sprite
        this.isWithin = this.physics.add.sprite(100, 450);
        this.isWithin.displayWidth = 60 * 1.2;
        this.isWithin.displayHeight = 65 * 1.5;



        // keybindings
        this.leftKey = this.input.keyboard.addKey('A');
        this.rightKey = this.input.keyboard.addKey('D');
        this.upKey = this.input.keyboard.addKey('W');
        this.downKey = this.input.keyboard.addKey('S');
        this.interactKey = this.input.keyboard.addKey('F');

        // sprite animation
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


        this.candleLayer = map.getObjectLayer("Candles", 0, 0)['objects'];
        this.candleGroup = this.physics.add.staticGroup()

        this.candleLayer.forEach(object => {
            this.candleGroup.add(this.add.sprite(object.x * 1.75 + object.width, object.y * 1.75 - object.width, object.name)
                .setScale(1.75))
            this.lights.addLight(object.x * 1.75 + object.width, object.y * 1.75 - object.width, 150).setColor(0xEED6A7).setIntensity(3);
        })

        this.anims.create({
            key: 'burn',
            frames: [
                { key: 'candle1', frame: null },
                // { key: 'candle2', frame: null },
                // { key: 'candle3', frame: null },
                { key: 'candle4', frame: null, duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.lights.enable();
        this.lights.setAmbientColor(0x806666);

        this.candleGroup.getChildren().forEach(function (candle) {
            candle.anims.play('burn', true);
            candle.setDepth(1);
        });

        //game over text
        this.gameOverText = this.add.text(this.screenCenterX, 100, 'Game Over', { fontSize: '64px', fill: '#FFF' });
        this.gameOverText.setOrigin(0.5, 0.5);
        this.gameOverText.scrollFactorX = 0;
        this.gameOverText.scrollFactorY = 0;
        this.gameOverText.visible = false;

        this.cameras.main.startFollow(this.player);


        this.light = this.lights.addLight(this.player.x, this.player.y, 150).setColor(0xFFFFFF).setIntensity(5);

        this.bridgeLight1 = this.lights.addLight(1473, 1932, 150).setColor(0xBD8AC5).setIntensity(3);
        this.bridgeLight2 = this.lights.addLight(1129, 1456, 150).setColor(0xBD8AC5).setIntensity(3);
        // this.bridgeLight3 = this.lights.addLight(1129, 1308, 150).setColor(0xBD8AC5).setIntensity(3);
        // this.bridgeLight4 = this.lights.addLight(1473, 1308, 150).setColor(0xBD8AC5).setIntensity(3);

        // this.candleLight = this.lights.addLight(472, 2268, 100).setColor(0xEEB950).setIntensity(1);

        // light affect object        
        this.groundLayer.setPipeline('Light2D');
        this.wallsLayer.setPipeline('Light2D');
        this.propLayer.setPipeline('Light2D');
        this.decorativeLayer.setPipeline('Light2D');


        // player collider with objects
        this.physics.add.collider(this.player, this.chests);
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.propLayer);
        this.physics.add.collider(this.player, this.decorativeLayer);
        this.physics.add.collider(this.player, this.itemsGroup);
        this.physics.add.collider(this.player, this.doorsGroup);

        // invisible sprite overlap with chests
        this.physics.add.overlap(this.isWithin, this.itemsGroup, this.chestOverlap, null, this);

        this.physics.add.overlap(this.isWithin, this.doorsGroup, this.doorOverlap, null, this);

        // form sockets
        this.socket.on('questionToAsk', (question) => this.showQuestion(question));
        this.socket.on('result', (result, hint) => this.showResult(result, hint));
        this.socket.on('incorrect chest', (message) => this.inCorrectChest(message));
    }

    update() {
        // reset player movement if no keybind is pressed
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        // copying the player's movement
        this.isWithin.x = this.player.x;
        this.isWithin.y = this.player.y;

        // player movement
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
        if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            this.player.anims.play('stop', true);
        }

        //hp text update
        this.hpText.setText("HP: " + this.health);

        //light
        this.light.x = this.player.x;
        this.light.y = this.player.y;


    }

    chestOverlap(player, chest) {
        // send chestID to the server
        if (this.interactKey.isDown) {
            this.disableInput();
            this.hintX = chest.x;
            this.hintY = chest.y;
            console.log('Chest id: ' + chest.getData('id'));
            this.socket.emit('getQuestion', chest.getData('id'), this.currentLevel);
        }
    }

    doorOverlap(player, door) {
        if (this.interactKey.isDown) {
            if (door.getData('id') == this.currentLevel && this.score == 3) {
                this.currentLevel += 1;
                this.player.x = 176;
                this.player.y = 2698;
            }
            if (door.getData('id') == this.currentLevel && this.score == 6) {
                this.currentLevel += 1;
                this.player.x = 2650;
                this.player.y = 1700;
            }
            if (door.getData('id') == this.currentLevel && this.score == 11) {
                this.scene.start('gameFinished');
            }
        }
    }
    showQuestion(question) {
        var socket = this.socket;
        var scene = this;
        console.log(question);
        var level = this.currentLevel;

        var form = this.add.dom(this.player.x - 200, this.player.y - 200).createFromCache("form");
        document.getElementById('q').innerHTML = question;
        form.addListener("click");

        form.on("click", function (event) {
            if (event.target.name === "sendAnswer") {
                var answer = this.getChildByName("answer");
                // console.log(answer.value);
                console.log(answer.value);
                console.log("odesilam zpravu z levelu %s", level);
                socket.emit('answer', answer.value, level);
                scene.enableInput();
                form.destroy();
            }
        })
    }

    showResult(result, hint) {
        // inform user about the result 
        if (result) {
            console.log('correct answer');
            console.log(hint);
            if (hint) {
                console.log(hint);
                this.hint = hint;
                this.hintText.setText("Hint: " + this.hint)
                this.hintText.x = this.hintX;
                this.hintText.y = this.hintY - 30;

                this.hintText.visible = true;
            }
            else {
                this.hintText.visible = false;
            }

            this.score += 1;
            console.log("score is: " + this.score);

        } else {
            console.log('wrong answer');
            this.health -= 1;

            if (this.health <= 0) {
                this.endGame();
            }
            console.log(this.health);
        }
        this.enableInput();
    }

    inCorrectChest(message) {
        var scene = this;
        var form = this.add.dom(this.player.x - 200, this.player.y - 200).createFromCache("formInvalid");
        form.addListener("click");

        form.on("click", function (event) {
            if (event.target.name === "sendAnswer") {

                scene.enableInput();
                form.destroy();
            }
        })
        console.log('incorrect chest!');
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
        this.player.body.setSize(20, 20, 0, 0);
    }

    endGame() {
        this.scene.start('gameOver');
    }

    timerCounter() {
        this.timeLeft--;
        const remainingMinutes = Math.floor(this.timeLeft / 60);
        const remainingSeconds = this.timeLeft % 60;
        const remainingTime = `Time left: ${remainingMinutes}m ${remainingSeconds}s `;
        this.timerText.setText(remainingTime);

        if (this.timeLeft < 20) {
            this.timerText.setColor('#FF0000');
            this.timerText.setScale(1.5); // nastaví červenou barvu
        }
    }
}
