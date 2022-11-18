const fs = require('fs');

let rawQuestions = fs.readFileSync('questions.json');
let questions = JSON.parse(rawQuestions);

//extract questions from questions.json
//HISTORY
let historyQ = [];
for (let question of questions.history) {
    historyQ.push(question.q)
}
let historyA = []
for (let question of questions.history) {
    historyA.push(question.a)
}
// console.log(historyQ, historyA);

//GEOGRAPHY
var geographyQ = [];
for (let question of questions.geography) {
    geographyQ.push(question.q)
}
let geographyA = []
for (let question of questions.geography) {
    geographyA.push(question.a)
}
// console.log(geographyQ, geographyA);

//MATH
let mathQ = [];
for (let question of questions.math) {
    mathQ.push(question.q)
}
let mathA = []
for (let question of questions.math) {
    mathA.push(question.a)
}
// console.log(mathQ, mathA);


module.exports = { historyQ, historyA, geographyQ, geographyA, mathQ, mathA }

