class loadAssets extends Phaser.Scene {
    constructor() {
        super('loadAssets');
    }

    preload() {
        this.load.image('star', 'client/assets/images/star.png');
        this.load.image('chest', 'client/assets/images/box.png');

        this.load.image('ui-heart-empty', 'client/assets/images/ui_heart_empty.png');
        this.load.image('ui-heart-full', 'client/assets/images/ui_heart_full.png');

        this.load.image('treasure', 'client/assets/images/treasure.png');
        this.load.image('picture_1', 'client/assets/images/picture_1.png');
        this.load.image('library', 'client/assets/images/library.png');
        this.load.image('grave_open', 'client/assets/images/grave_open.png');
        this.load.image('scroll', 'client/assets/images/scroll.png');

        this.load.image('books_blue_left', 'client/assets/images/books_blue_left.png');
        this.load.image('books_blue_right', 'client/assets/images/books_blue_right.png');

        this.load.image('books_brown_left', 'client/assets/images/books_brown_left.png');
        this.load.image('books_brown_right', 'client/assets/images/books_brown_right.png');

        this.load.image('books_left', 'client/assets/images/books_left.png');
        this.load.image('books_right', 'client/assets/images/books_right.png');

        this.load.image('chest_green_left', 'client/assets/images/chest_green_left.png');
        this.load.image('chest_green_right', 'client/assets/images/chest_green_right.png');

        this.load.image('chest_red_left', 'client/assets/images/chest_red_left.png');
        this.load.image('chest_red_right', 'client/assets/images/chest_red_right.png');

        this.load.image('doors', 'client/assets/images/doors.png');





        this.load.spritesheet('dude', 'client/assets/images/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('boy', 'client/assets/images/boy.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.html("form", 'client/assets/forms/form.html');
        this.load.html("formInvalid", 'client/assets/forms/formInvalid.html');

        // this.load.image("tiles", "client/assets/tilesmap/tiles/escape_room2.png");
        // this.load.tilemapTiledJSON('map', "client/assets/tilesmap/json/map2.json");
        // this.load.image("props", "client/assets/tilesmap/tiles/props.png");
        // this.load.image("furnitureTiles", "client/assets/tilesmap/tiles/ClassRoom.png");
        this.load.image("tiles", "client/assets/tilesmap/tiles/cata_1.png");
        this.load.image("tiles_props", "client/assets/tilesmap/tiles/cata_2.png");
        this.load.image("tiles_decorative", "client/assets/tilesmap/tiles/decorative.png");
        this.load.tilemapTiledJSON('map', "client/assets/tilesmap/json/map3.json");
    }

    create() {
        this.scene.start('playGame');
    }
}