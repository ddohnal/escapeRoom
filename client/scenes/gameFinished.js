class gameFinished extends Phaser.Scene {
    constructor() {
        super('gameFinished');
    }

    preload() {
        this.load.image('button_back', 'client/assets/buttons/button_back.png');
    }
    create() {
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.gameOverText = this.add.text(this.screenCenterX, this.screenCenterY - 150, "YOU ESCAPED!!!", {
            font: '64px Arial'
        })
            .setOrigin(0.5, 0.5);
        this.gameOverText.setTint(0xff0000, 0xffff00, 0x6C0505, 0x6C0505);

        this.backButton = this.add.image(this.screenCenterX, this.screenCenterY + 200, 'button_back')
            .setScale(0.2)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('menu');
            });

    }

    update() {
        // this.scene.start('playGame');
    }

}