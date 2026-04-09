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

const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

// GET hele quizzen (til frontend visning)
router.get("/:quizName", async (req, res) => {
    try {
        const quizName = req.params.quizName;

        const filePath = path.join(
            __dirname,
            "..",
            "data",
            "quizzes",
            `${quizName}.xml`
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Quiz ikke fundet" });
        }

        const xmlData = fs.readFileSync(filePath, "utf-8");
        const parsed = await xml2js.parseStringPromise(xmlData);

        res.json(parsed.quiz);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server fejl" });
    }
});


module.exports = router;