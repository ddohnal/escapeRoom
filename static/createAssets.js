class createAssets extends Phaser.Scene {
    constructor() {
        super('createAssets');
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
        this.scene.start('playGame');
    }
}