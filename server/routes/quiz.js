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

// gem resultat
router.post("/submit", async (req, res) => {
    try {
        const { quiz, user, score } = req.body;

        const filePath = path.join(__dirname, "..", "data", "results.xml");

        let resultsObj;

        // læs eksisterende XML
        if (fs.existsSync(filePath)) {
            const xmlData = fs.readFileSync(filePath, "utf-8");
            resultsObj = await xml2js.parseStringPromise(xmlData);
        } else {
            resultsObj = { results: { result: [] } };
        }

        //  lav unikt attemptId
        const timestamp = Date.now();
        const attemptId = `${user}-${timestamp}`;

        //  nyt resultat 
        const newResult = {
            attemptId: attemptId,
            userId: user,
            quizId: quiz,
            score: score.toString(),
            time: "0", // du kan forbedre senere
            date: new Date().toISOString()
        };

        //  sørg for array
        if (!resultsObj.results.result) {
            resultsObj.results.result = [];
        }

        resultsObj.results.result.push(newResult);

        // convert til XML
        const builder = new xml2js.Builder();
        const xml = builder.buildObject(resultsObj);

        fs.writeFileSync(filePath, xml);

        res.json({ success: true });

    } catch (err) {
        console.error("Fejl ved gemning:", err);
        res.status(500).json({ error: "Kunne ikke gemme resultat" });
    }
});

module.exports = router;