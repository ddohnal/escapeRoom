class control_menu extends Phaser.Scene {
    constructor() {
        super('control_menu');
    }

    preload() {

        this.load.image('button_back', 'client/assets/buttons/button_back.png');
    }
    create() {



        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.controlText = this.add.text(this.screenCenterX, this.screenCenterY, "W -> move up\nS -> move down\nA -> move left\nD -> move right\nF -> interact with objects", {
            wordWrap: true,
            wordWrapWidth: 300,
            lineSpacing: 30
        })
            .setOrigin(0.5, 0.5);

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