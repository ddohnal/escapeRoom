var game;

window.onload = function () {

    let config = {
        type: Phaser.AUTO,

        backgroundColor: '#000',


        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: [
            loadAssets,
            playGame
        ],
        parent: 'show-form',
        dom: {
            createContainer: true
        },
        scale: {
            zoom: 1
        }
    }
    game = new Phaser.Game(config);
}








