if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io')
const { historyQ, historyA, geographyQ, geographyA, mathQ, mathA } = require('./questionExtract');


const app = express()
var server = http.Server(app)
var io = socketIO(server, {
    pingTimeout: 60000,
})

var players = {}
var questionToAsk;

const PORT = process.env.PORT || 5000;


app.use('/client', express.static(__dirname + '../../client'))
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '../client/index.html'))
})

// console.log(Array.from(Array(historyQ.length).keys()).sort((a, b) => 0.5 - Math.random()).slice(0, 2));


io.on('connection', function (socket) {
    console.log('=>[received][%s]: connected', socket.id);

    players[socket.id] = {

        currentLevel: 0,
        //first level params        
        questionsFirstLevel: historyQ,
        answersFirtLevel: historyA,
        chestFirstLevelID: [1, 2, 3].sort(() => Math.random() - 0.5),
        randomQuestionsFirstLevel: Array.from(Array(historyQ.length).keys()).sort((a, b) => 0.5 - Math.random()).slice(0, 3), //generate sequence of questions

        //second level params        
        questionsSecondLevel: geographyQ,
        answersSecondLevel: geographyA,
        randomQuestionsSecondLevel: Array.from(Array(geographyQ.length).keys()).sort((a, b) => 0.5 - Math.random()).slice(0, 3),
        chestSecondLevelID: [4, 5, 6].sort(() => Math.random() - 0.5),

        //third level params        
        questionsThirdLevel: mathQ,
        answersThirdLevel: mathA,
        randomQuestionsThirdLevel: Array.from(Array(mathQ.length).keys()).sort((a, b) => 0.5 - Math.random()).slice(0, 5),
        chestThirdLevelID: [7, 8, 9, 10, 11].sort(() => Math.random() - 0.5),

        hints: ["grave", "books", "chest", "library", "books", "books on desk", "grave", "statue", "books", "green chest", "red chest"]
    }



    socket.on('getQuestion', (chestId, level) => {
        console.log('=>[received][%s]: asked question for chest %s in %s level', socket.id, chestId, level);

        if (level == 1) {
            if (chestId === players[socket.id].chestFirstLevelID[0]) {
                questionToAsk = players[socket.id].questionsFirstLevel[players[socket.id].randomQuestionsFirstLevel[0]];
                socket.emit('questionToAsk', questionToAsk);
                console.log('<=[sent][%s]: question "%s"', socket.id, questionToAsk);
            } else {
                socket.emit('incorrect chest', 'This item is not available');
                console.log('<=[sent][%s]: this item is not available', socket.id);
            }
        }
        if (level == 2) {
            if (chestId === players[socket.id].chestSecondLevelID[0]) {
                questionToAsk = players[socket.id].questionsSecondLevel[players[socket.id].randomQuestionsSecondLevel[0]];
                socket.emit('questionToAsk', questionToAsk);
                console.log('<=[sent][%s]: question "%s"', socket.id, questionToAsk);
            } else {
                socket.emit('incorrect chest', 'This item is not available');
                console.log('<=[sent][%s]: this item is not available', socket.id);
            }
        }
        if (level == 3) {
            if (chestId === players[socket.id].chestThirdLevelID[0]) {
                questionToAsk = players[socket.id].questionsThirdLevel[players[socket.id].randomQuestionsThirdLevel[0]];
                socket.emit('questionToAsk', questionToAsk);
                console.log('<=[sent][%s]: question "%s"', socket.id, questionToAsk);
            } else {
                socket.emit('incorrect chest', 'This item is not available');
                console.log('<=[sent][%s]: this item is not available', socket.id);
            }

        }

        //check if chest.id is equal of chestFirstLevel[0]

    })

    socket.on('answer', (userAnswer, level) => {
        console.log('=>[received][%s]: answer "%s in level: %s"', socket.id, userAnswer, level);

        if (level == 1) {
            if (players[socket.id].answersFirtLevel[players[socket.id].randomQuestionsFirstLevel[0]].toLowerCase().replace(/\s/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") === userAnswer) {

                let chest = players[socket.id].chestFirstLevelID[0];

                players[socket.id].randomQuestionsFirstLevel.shift();
                players[socket.id].chestFirstLevelID.shift();


                socket.emit('result', true, players[socket.id].hints[players[socket.id].chestFirstLevelID[0] - 1] ? players[socket.id].hints[players[socket.id].chestFirstLevelID[0] - 1] : "you can go to the next room");
                console.log('<=[sent][%s]: correct, chest %s removed, remaining %s', socket.id, chest, players[socket.id].chestFirstLevelID);
            } else {
                socket.emit('result', false);
                console.log('<=[sent][%s]: incorrect', socket.id);
            }
        }
        if (level == 2) {
            if (players[socket.id].answersSecondLevel[players[socket.id].randomQuestionsSecondLevel[0]].toLowerCase().replace(/\s/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") === userAnswer) {

                let chest = players[socket.id].chestSecondLevelID[0];

                players[socket.id].randomQuestionsSecondLevel.shift();
                players[socket.id].chestSecondLevelID.shift();

                socket.emit('result', true, players[socket.id].hints[players[socket.id].chestSecondLevelID[0] - 1] ? players[socket.id].hints[players[socket.id].chestSecondLevelID[0] - 1] : "you can go to the next room");
                console.log('<=[sent][%s]: correct, chest %s removed, remaining %s', socket.id, chest, players[socket.id].chestSecondLevelID);
            } else {
                socket.emit('result', false);
                console.log('<=[sent][%s]: incorrect', socket.id);
            }
        }
        if (level == 3) {
            if (players[socket.id].answersThirdLevel[players[socket.id].randomQuestionsThirdLevel[0]].toLowerCase().replace(/\s/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "") === userAnswer) {

                let chest = players[socket.id].chestThirdLevelID[0];

                players[socket.id].randomQuestionsThirdLevel.shift();
                players[socket.id].chestThirdLevelID.shift();

                socket.emit('result', true, players[socket.id].hints[players[socket.id].chestThirdLevelID[0] - 1] ? players[socket.id].hints[players[socket.id].chestThirdLevelID[0] - 1] : "you can escape now!!!");
                console.log('<=[sent][%s]: correct, chest %s removed, remaining %s', socket.id, chest, players[socket.id].chestThirdLevelID);
            } else {
                socket.emit('result', false);
                console.log('<=[sent][%s]: incorrect', socket.id);
            }
        }

    })

    socket.on('disconnect', () => {
        console.log('=>[received][%s]: disconnected', socket.id);
        delete players[socket.id];
    })
})

server.listen(PORT, function () {
    console.log(`Our app is running on port ${PORT}`)
})





