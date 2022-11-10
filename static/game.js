var game;

window.onload = function () {

    let config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 1920,
        height: 1080,
        backgroundColor: '#D5A459',
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
                gravity: { y: 0 }
            }
        },
        scene: [
            loadAssets,
            // createAssets,
            playGame

        ]
    }
    game = new Phaser.Game(config);
}








