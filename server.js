const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');


const app = express()
var server = http.Server(app)

let rawQuestions = fs.readFileSync('questions.json');
let questions = JSON.parse(rawQuestions);


app.set('port', 5000)
app.use('/static', express.static(__dirname + '/static'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'))
})



server.listen(5000, function () {
    console.log('Starting server on port 5000')
})





