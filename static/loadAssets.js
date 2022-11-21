class loadAssets extends Phaser.Scene {
    constructor() {
        super('loadAssets');
    }

    preload() {
        this.load.image('star', 'static/assets/star.png');
        this.load.image('chest', 'static/assets/box.png')
        this.load.spritesheet('dude', 'static/assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('boy', 'static/assets/boy.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.html("form", 'static/form.html');
    }
    create() {
        this.scene.start('playGame');
    }
}