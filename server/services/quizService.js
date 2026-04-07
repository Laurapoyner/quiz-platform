/**
 * quizService.js
 * 
 * Ansvar: 
 * Håndterer al quiz-logik på serveren
 * 
 * Indeholder funktioner til:
 * - at starte en quiz
 * - at håndtere brugerens svar
 * - at beregne score
 * - at styre quiz flow (spørgsmål, progression)
 * 
 * NOTE:
 * Indeholder IKKE API routes eller database-logik
 */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const sessions = {};

async function startQuiz(quizId, user) {
    const quiz = await loadQuiz(quizId);

    console.log("Quiz loaded:", JSON.stringify(quiz, null, 2));

    return { message: "Quiz loaded" };
}

function answerQuestion(sessionId, answer) {
    return { message: "not implemented " };
}

function getResult(sessionId) {
    return { message: "not implemented" };
}

async function loadQuiz(quizId) {
    const filePath = path.join(__dirname, '../../data/quizzes', `${quizId}.xml`);

    const xml = fs.readFileSync(filePath, 'utf-8');

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    return result.quiz;
}

module.exports = {
    startQuiz,
    answerQuestion,
    getResult
};

startQuiz(quiz1);