var game;

window.onload = function () {

    let config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#000',


        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },

        scene: [
            menu,
            controlMenu,
            loadAssets,
            playGame,
            gameOver
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








