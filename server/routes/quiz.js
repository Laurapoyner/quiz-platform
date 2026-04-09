//quiz
/**
 * Midlertidig router
 * Skal udvides med rigtige endpoints
 */
const express = require('express');
const router = express.Router();
const { startQuiz, answerQuestion } = require("../services/quizService");
const { submitQuiz } = require("../services/quizService");
const { getQuizForUser } = require("../services/quizService");

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

router.post("/submit", async (req, res) => {
    try {
        const { quizId, answers } = req.body;

        if (!quizId || !answers) {
            return res.status(400).json({ error: "Missing quizId or answers" });
        }

        const result = await submitQuiz(quizId, answers);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:quizId", async (req, res) => {
    try {
        const quiz = await getQuizForUser(req.params.quizId);
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;