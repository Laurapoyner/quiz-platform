const express = require('express');
const router = express.Router();

const { startQuiz, answerQuestion } = require("../services/quizService");

const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");


// START QUIZ
router.post("/start", async (req, res) => {
    const { quizId, user } = req.body;

    const result = await startQuiz(quizId, user);
    res.json(result);
});


// ANSWER QUESTION
router.post("/answer", (req, res) => {
    const { sessionId, answer } = req.body;

    const result = answerQuestion(sessionId, answer);
    res.json(result);
});


// GET QUIZ (læser fra /data/quizzes)
router.get("/:quizName", async (req, res) => {
    try {
        const quizName = req.params.quizName;

        const filePath = path.join(__dirname, "../../data/quizzes", `${quizName}.xml`);

        console.log("GET QUIZ PATH:", filePath);

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


// GEM RESULTAT (læser/skriver i /data/results.xml)
router.post("/submit", async (req, res) => {
    try {
        const { quiz, user, score, time } = req.body;

        const filePath = path.join(__dirname, "../../data/results.xml");

        console.log("SAVE RESULT PATH:", filePath);

        let resultsObj;

        // læs eksisterende XML
        if (fs.existsSync(filePath)) {
            const xmlData = fs.readFileSync(filePath, "utf-8");
            resultsObj = await xml2js.parseStringPromise(xmlData);
        } else {
            resultsObj = { results: { result: [] } };
        }

        // unikt ID
        const attemptId = `${user}-${Date.now()}`;

        // resultat
        const newResult = {
            attemptId: [attemptId],
            userId: [user],
            quizId: [quiz],
            score: [score.toString()],
            time: [time ? time.toString() : "0"],
            date: [new Date().toISOString()]
        };

        // sørg for array findes
        if (!resultsObj.results.result) {
            resultsObj.results.result = [];
        }

        resultsObj.results.result.push(newResult);

        // gem XML
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