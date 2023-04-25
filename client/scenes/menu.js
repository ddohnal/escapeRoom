class menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }

    preload() {
        this.load.image('button_new_game', 'client/assets/buttons/button_new_game.png');
        this.load.image('button_controls', 'client/assets/buttons/button_controls.png');
        this.load.image('button_rules', 'client/assets/buttons/button_rules.png');
    }
    create() {
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;


        this.newGameButton = this.add.image(this.screenCenterX, this.screenCenterY - 150, 'button_new_game')
            .setScale(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('loadAssets');
            });

        this.controlButton = this.add.image(this.screenCenterX, this.screenCenterY, 'button_controls')
            .setScale(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('controlMenu');
            });
        // this.rulesButton = this.add.image(this.screenCenterX, this.screenCenterY + 150, 'button_rules')
        //     .setScale(0.5)
        //     .setInteractive()
        //     .on('pointerdown', () => {
        //     });

    }

    update() {
        // this.scene.start('playGame');
    }

}