var game;

window.onload = function () {

    let config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 1920,
        height: 1080,
        backgroundColor: '#ffffff',
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
                gravity: { y: 0 }
            }
        },
        scene: [
            playGame
        ]
    }
    game = new Phaser.Game(config);
}








