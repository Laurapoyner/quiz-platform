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

    const sessionId = Date.now().toString();

    sessions[sessionId] = {
        user,
        questions: quiz.question,
        currentQuestionIndex: 0,
        score: 0
    };

    const firstQuestion = quiz.question[0];

    return {
        sessionId,
        question: firstQuestion.questiontext[0],
        answers: firstQuestion.answer.map(a => a.answertext[0])
    };
}

function answerQuestion(sessionId, answer) {
    const session = sessions[sessionId];

    if (!session) {
        return { error: "Session not found" };
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];

    const answers = currentQuestion.answer;

    // find alle korrekte svar
    const correctAnswers = answers
        .filter(a => a.correct[0] === "True")
        .map(a => a.answertext[0]);

    // tjek om brugerens svar er korrekt
    if (correctAnswers.includes(answer)) {
        session.score += 1;
    }

    // gå videre til næste spørgsmål
    session.currentQuestionIndex += 1;

    // hvis der er flere spørgsmål
    if (session.currentQuestionIndex < session.questions.length) {
        const nextQuestion = session.questions[session.currentQuestionIndex];

        return {
            sessionId,
            question: nextQuestion.questiontext[0],
            answers: nextQuestion.answer.map(a => a.answertext[0])
        };
    }

    // ellers er quiz færdig
    return {
        sessionId,
        finished: true,
        score: session.score
    };
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

