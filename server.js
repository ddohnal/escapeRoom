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

app.set('port', 5000)
app.use('/static', express.static(__dirname + '/static'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', function (socket) {
    console.log('player [' + socket.id + '] connected')

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
        console.log('*****************************************');
        console.log('player: ' + socket.id + ' -> message: ' + arg);

        //check if chest.id is equal of chestFirstLevel[0]
        if (arg == players[socket.id].chestFirstLevelID[0]) {
            questionToAsk = players[socket.id].questionsFirstLevel[players[socket.id].randomQuestionsFirstLevel[0]];
            socket.emit('questionToAsk', questionToAsk);
            console.log('Message: ' + questionToAsk + ' sent to player with id:' + socket.id);

            console.log('waiting for answer');

        }

    })
    socket.on('answer', (arg) => {
        console.log('player answer is: ' + arg);
        if (players[socket.id].answersFirtLevel[players[socket.id].randomQuestionsFirstLevel[0]] == arg) {
            console.log('the player answered correctly');
            socket.emit('result', true);

            console.log('Question removed: ' + players[socket.id].randomQuestionsFirstLevel[0]);
            players[socket.id].randomQuestionsFirstLevel.shift();
            console.log('Rest of random question: ' + players[socket.id].randomQuestionsFirstLevel);

            console.log('Chest ID removed: ' + players[socket.id].chestFirstLevelID[0]);
            players[socket.id].chestFirstLevelID.shift();
            console.log('Rest of chestID to pick up: ' + players[socket.id].chestFirstLevelID);
        }
        else {
            socket.emit('result', false);
        }
    })
})

server.listen(5000, function () {
    console.log('Starting server on port 5000')
})





