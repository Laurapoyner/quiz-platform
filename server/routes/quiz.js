//quiz
/**
 * Midlertidig router
 * Skal udvides med rigtige endpoints
 */
const express = require('express');
const router = express.Router();

const { startQuiz, answerQuestion } = require("../services/quizService");

// start quiz
router.post("/start", async (req, res) => {
    const { quizId, user } = req.body;

    const result = await startQuiz(quizId, user);

    res.json(result);
});

// answer question
router.post("/answer", (req, res) => {
    const { sessionId, answer } = req.body;

    const result = answerQuestion(sessionId, answer);

    res.json(result);
});

module.exports = router;