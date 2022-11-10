class loadAssets extends Phaser.Scene {
    constructor() {
        super('loadAssets');
    }

    preload() {
        this.load.image('star', 'static/assets/star.png');
        this.load.spritesheet('dude', 'static/assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
    create() {
        this.scene.start('playGame');
    }
}