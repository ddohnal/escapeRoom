class loadAssets extends Phaser.Scene {
    constructor() {
        super('loadAssets');
    }

    preload() {
        this.load.image('star', 'client/assets/images/star.png');
        this.load.image('chest', 'client/assets/images/box.png');

        this.load.image('ui-heart-empty', 'client/assets/images/ui_heart_empty.png');
        this.load.image('ui-heart-full', 'client/assets/images/ui_heart_full.png');


        this.load.spritesheet('dude', 'client/assets/images/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('boy', 'client/assets/images/boy.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.html("form", 'client/assets/forms/form.html');
        this.load.html("formInvalid", 'client/assets/forms/formInvalid.html');

        this.load.image("tiles", "client/assets/tilesmap/tiles/escape_room2.png");
        this.load.tilemapTiledJSON('map', "client/assets/tilesmap/json/map2.json");

    }

    create() {
        this.scene.start('playGame');
    }
}