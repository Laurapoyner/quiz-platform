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

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

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

async function submitQuiz(quizId, userAnswers) {
    const quiz = await loadQuiz(quizId);

    let totalScore = 0;
    const results = [];

    quiz.question.forEach((q) => {
        const qId = q.id[0];

        const answers = q.answer;

        // find korrekte svar
        const correctIndexes = answers
            .map((a, i) => a.correct[0] === "True" ? i : null)
            .filter(i => i !== null);

        let selected = userAnswers[qId];

        // kompatibel med både single og multiple
        if (selected === undefined) {
            selected = [];
        } else if (!Array.isArray(selected)) {
            selected = [selected];
        }

        let questionScore = 0;

        // + point for rigtige
        correctIndexes.forEach(i => {
            if (selected.includes(i)) {
                questionScore += 1 / correctIndexes.length;
            }
        });

        // - point for forkerte
        selected.forEach(i => {
            if (!correctIndexes.includes(i)) {
                questionScore -= 1 / correctIndexes.length;
            }
        });

        totalScore += questionScore;

        results.push({
            questionId: qId,
            correct: questionScore > 0
        });
    });

    return {
        score: Math.max(0, totalScore),
        total: quiz.question.length,
        results
    };
}

async function getQuizForUser(quizId) {
    const quiz = await loadQuiz(quizId);

    const shuffledQuestions = shuffle(quiz.question);

    return {
        topic: quiz.topic?.[0] || "Quiz",
        questions: shuffledQuestions.map((q) => {

            const shuffledAnswers = shuffle(
                q.answer.map((a, index) => ({
                    originalIndex: index,
                    text: a.answertext[0]
                }))
            );

            return {
                id: q.id[0],
                questiontext: q.questiontext[0],
                answers: shuffledAnswers.map(a => ({
                    id: a.originalIndex,
                    text: a.text
                }))
            };
        })
    };
}

module.exports = {
    startQuiz,
    answerQuestion,
    getResult,
    submitQuiz,
    getQuizForUser
};

