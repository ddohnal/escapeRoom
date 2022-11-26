class showForm extends Phaser.Scene {
    constructor() {
        super("showForm");

    }

    create(id) {
        this.socket.emit('getQuestion', id);
        console.log('getQuestion ' + id);
        console.log(socket);
        var element = this.add.dom(400, 600).createFromCache("form");
        var scene = this.scene;
        var self = this;
        element.setPerspective(800);
        element.addListener("click");
        // element.getChildByID("question").append(questionToAsk["q"]);

        element.on("click", function (event) {


            if (event.target.name === "sendAnswer") {

                var answer = this.getChildByName("answer");

                //  Have they entered anything?
                if (answer.value !== '' && answer.value !== '') {
                    //  Turn off the click events
                    this.removeListener("click");

                    //  Tween the login form out
                    this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });

                    this.scene.tweens.add({
                        targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 3000, ease: 'Power3',
                        onComplete: function () {
                            element.setVisible(false);
                            scene.pause();
                            scene.resume("PlayGame");
                        }
                    });
                }
                // if (answer.value == questionToAsk["a"]) {
                //     if (questionToAsk["isChest"]) {
                //         self.events.emit("chestOpen");
                //     }
                //     else {
                //         self.events.emit("endGame");
                //     }

                // }

            }

        });

        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: 'Power3'
        });
    }
}
