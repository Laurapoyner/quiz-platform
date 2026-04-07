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

    const title = quiz.title[0];
    const questions = quiz.question;

    const firstQuestion = questions[0];

    return {
        title,
        question: firstQuestion.text[0],
        answers: firstQuestion.answers[0].answer.map(a => a._)
    };
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

