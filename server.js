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

var players = {}
var test = 1;


app.set('port', 5000)
app.use('/static', express.static(__dirname + '/static'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', function (socket) {
    console.log('player [' + socket.id + '] connected')

    socket.on('test', (arg) => {
        console.log('player: ' + socket.id + ' -> message: ' + arg);
        if (arg == 'ahoj') {
            socket.emit('test2', test);
            console.log('Message: cau sended to player with id:' + socket.id);
            test += 1;
        }
    })
})



server.listen(5000, function () {
    console.log('Starting server on port 5000')
})





