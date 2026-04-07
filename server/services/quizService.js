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

const sessions = {};

async function startQuiz(quizId, user) {
    return { message: "not implemented" };
}

function answerQuestion(sessionId, answer) {
    return { message: "not implemented " };
}

function getResult(sessionId) {
    return { message: "not implemented" };
}

module.exports = {
    startQuiz,
    answerQuestion,
    getResult
};