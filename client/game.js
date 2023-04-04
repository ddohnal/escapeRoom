var game;

window.onload = function () {

    let config = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        backgroundColor: '#000',


        physics: {
            default: 'arcade',
            arcade: {
                debug: true
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








