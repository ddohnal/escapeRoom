const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io')


const app = express()
var server = http.Server(app)
var io = socketIO(server, {
    pingTimeout: 60000,
})

let rawQuestions = fs.readFileSync('questions.json');
let questions = JSON.parse(rawQuestions);

console.log(questions.history[0].q);
var players = {}
var questionToAsk;


app.set('port', 5000)
app.use('/static', express.static(__dirname + '/static'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', function (socket) {
    console.log('player [' + socket.id + '] connected')

    socket.on('getQuestion', (arg) => {
        console.log('player: ' + socket.id + ' -> message: ' + arg);
        if (arg == 1) {
            questionToAsk = questions.history[0].q
            socket.emit('questionToAsk', questionToAsk);
            console.log('Message: ' + questionToAsk + ' sent to player with id:' + socket.id);
        }
        console.log('waiting for answer');
        socket.on('answer', (arg) => {
            console.log('player answer is: ' + arg);
            if (questions.history[0].a == arg) {
                socket.emit('result', true);
            }
            else {
                socket.emit('result', false);
            }
        })
    })
})



server.listen(5000, function () {
    console.log('Starting server on port 5000')
})





