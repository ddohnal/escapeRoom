if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io')
const { historyQ, historyA, geographyQ, geographyA, mathQ, mathA } = require('./questionExtract');

console.log(historyQ);
const app = express()
var server = http.Server(app)
var io = socketIO(server, {
    pingTimeout: 60000,
})

var players = {}
var questionToAsk;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`)
})
app.use('/client', express.static(__dirname + '../../client'))
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '../client/index.html'))
})

io.on('connection', function (socket) {
    console.log('=>[received][%s]: connected', socket.id);

    players[socket.id] = {
        //first level params
        completeFirstLevel: false,
        questionsFirstLevel: historyQ,
        answersFirtLevel: historyA,
        randomQuestionsFirstLevel: Array.from(Array(historyQ.length).keys()).sort((a, b) => 0.5 - Math.random()), //generate sequence of questions
        chestFirstLevelID: [1, 2, 3, 4],

        //second level params
        completeSecondLevel: false,
        questionsSecondLevel: geographyQ,
        answersSecondLevel: geographyA,
        randomQuestionsSecondLevel: Array.from(Array(geographyQ.length).keys()).sort((a, b) => 0.5 - Math.random()),
        chestSecondLevelID: [1, 2, 3, 4],

        //third level params
        completeThirdLevel: false,
        questionsThirdLevel: mathQ,
        answersThirdLevel: mathA,
        randomQuestionsThirdLevel: Array.from(Array(mathQ.length).keys()).sort((a, b) => 0.5 - Math.random()),
        chestThirdLevelID: [1, 2, 3, 4],
    }

    socket.on('getQuestion', (arg) => {
        console.log('=>[received][%s]: asked question for chest %s', socket.id, arg);

        //check if chest.id is equal of chestFirstLevel[0]
        if (arg === players[socket.id].chestFirstLevelID[0]) {
            questionToAsk = players[socket.id].questionsFirstLevel[players[socket.id].randomQuestionsFirstLevel[0]];
            socket.emit('questionToAsk', questionToAsk);
            console.log('<=[sent][%s]: question "%s"', socket.id, questionToAsk);
        } else {
            socket.emit('incorrect chest', 'This item is not available');
            console.log('<=[sent][%s]: this item is not available', socket.id);
        }
    })

    socket.on('answer', (arg) => {
        console.log('=>[received][%s]: answer "%s"', socket.id, arg);

        if (players[socket.id].answersFirtLevel[players[socket.id].randomQuestionsFirstLevel[0]] === arg) {

            let chest = players[socket.id].chestFirstLevelID[0];

            players[socket.id].randomQuestionsFirstLevel.shift();
            players[socket.id].chestFirstLevelID.shift();

            socket.emit('result', true);
            console.log('<=[sent][%s]: correct, chest %s removed, remaining %s', socket.id, chest, players[socket.id].chestFirstLevelID);
        } else {
            socket.emit('result', false);
            console.log('<=[sent][%s]: incorrect', socket.id);
        }
    })

    socket.on('disconnect', () => {
        console.log('=>[received][%s]: disconnected', socket.id);
        delete players[socket.id];
    })
})

server.listen(5000, function () {
    console.log('Starting server on port 5000')
})





