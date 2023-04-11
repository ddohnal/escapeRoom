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
        this.gameOverTime = 60;

        this.hint = "";
        this.hintX = 0;
        this.hintY = 0;

        this.timeLeft = this.gameOverTime;


        console.log(this.health);



        //tilesmap
        const map = this.make.tilemap({ key: "map", tileWidth: 30, tileHeight: 30 });

        const tileset = map.addTilesetImage("tiles1", "tiles");
        // const propstileset = map.addTilesetImage("tiles2", "props")
        const furnitureTileSet = map.addTilesetImage("tiles2", "furnitureTiles");

        this.groundLayer = map.createLayer("Ground", tileset, 0, 0);

        this.groundLayer.setScale(1.75);
        this.wallsLayer = map.createLayer("Walls", tileset, 0, 0);
        this.wallsLayer.setScale(1.75);
        // this.propLayer = map.createLayer("Props", propstileset, 0, 0);
        // this.furnitureLayer = map.createLayer("Furniture", furnitureTileSet, 0, 0);

        //enviroment collides setup
        // this.wallsLayer.setCollisionByProperty({ collides: true });
        // this.furnitureLayer.setCollisionByProperty({ collides: true });

        // this.itemLayer = map.getObjectLayer("Items")['objects'];
        // this.itemsGroup = this.physics.add.staticGroup()

        // this.itemLayer.forEach(object => {
        //     let obj = this.itemsGroup.create(object.x, object.y, object.name).setData('id', object.id);
        //     obj.setScale(1.5);
        //     let name = object.name;
        //     console.log(name);

        //     obj.body.width = object.width;
        //     obj.body.height = object.height;

        // })

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

        this.timerText = this.add.text(this.screenCenterX, 50, 'Time left: ' + this.timeLeft, { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' });
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
        this.player = this.physics.add.sprite(200, 200, 'boy');
        this.player.setSize(20, 20,);
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

        // form sockets
        this.socket.on('questionToAsk', (question) => this.showQuestion(question));
        this.socket.on('result', (result, hint) => this.showResult(result, hint));
        this.socket.on('incorrect chest', (message) => this.inCorrectChest(message));

        //game over text
        this.gameOverText = this.add.text(this.screenCenterX, 100, 'Game Over', { fontSize: '64px', fill: '#FFF' });
        this.gameOverText.setOrigin(0.5, 0.5);
        this.gameOverText.scrollFactorX = 0;
        this.gameOverText.scrollFactorY = 0;
        this.gameOverText.visible = false;

        this.cameras.main.startFollow(this.player);

        // this.cameras.main.ignore([this.movementText, this.interactKey, this.hearts]);

        // const UICam = this.cameras.add(0, 0, 800, 600);
        // UICam.ignore(this.player);


        // light
        this.lights.enable();
        this.lights.setAmbientColor(0x6AA578);
        this.light = this.lights.addLight(this.player.x, this.player.y, 150).setColor(0xFFFFFF).setIntensity(5);

        // light affect object
        // this.player.setPipeline('Light2D');
        this.groundLayer.setPipeline('Light2D');
        this.wallsLayer.setPipeline('Light2D');
        // this.furnitureLayer.setPipeline('Light2D');
    }

    update() {
        // player collider with objects
        this.physics.add.collider(this.player, this.chests);
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.furnitureLayer);
        this.physics.add.collider(this.player, this.itemsGroup);

        // invisible sprite overlap with chests
        this.physics.add.overlap(this.isWithin, this.itemsGroup, this.chestOverlap, null, this);

        this.player.setCollideWorldBounds(true);

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
            if (this.score == 3 || this.score == 6) {
                this.currentLevel += 1;
            }

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
        this.gameOver = true;
        this.gameOverText.visible = true;
        this.timerText.visible = false;

        setTimeout(() => {
            this.scene.restart();
        }, 3000)
    }

    timerCounter() {
        this.timeLeft--; // snižuje zbývající čas
        this.timerText.setText('Time left: ' + this.timeLeft); // aktualizuje text
    }
}
