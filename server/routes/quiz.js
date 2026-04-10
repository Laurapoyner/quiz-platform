const express = require('express');
const router = express.Router();
const { calculateScore } = require("../services/quizService");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

// GET QUIZ - Sender kun det nødvendige data til frontend
router.get("/:quizName", async (req, res) => {
    try {
        const filePath = path.join(__dirname, "../../data/quizzes", `${req.params.quizName}.xml`);
        const xmlData = fs.readFileSync(filePath, "utf-8");
        const parsed = await xml2js.parseStringPromise(xmlData);

        const cleanedQuestions = parsed.quiz.question.map((q, index) => ({
            id: q.id?.[0] || String(index),
            questiontext: q.questiontext?.[0],
            // Vi sender stadig typen, så frontend ved om det er radio eller checkbox
            type: q.answer.filter(a => a.correct?.[0] === "True").length > 1 ? "multi" : "single",
            answers: q.answer.map((a, i) => ({
                id: i,
                answertext: a.answertext?.[0]
                // VIGTIGT: Vi har slettet "correct: a.correct === 'True'" herfra!
            }))
        }));

        res.json({ topic: parsed.quiz.topic, questions: cleanedQuestions });
    } catch (err) {
        res.status(500).json({ error: "Kunne ikke hente quiz" });
    }
});

// Modtager svar, beregner score og gemmer i results.xml
router.post("/submit", async (req, res) => {
    try {
        const { quiz, user, answers, time } = req.body;
        console.log(`Modtaget submit for ${quiz} fra ${user}`);

        const score = await calculateScore(quiz, answers);

        // 1. Hent facit til feedback
        const quizFilePath = path.join(__dirname, "../../data/quizzes", `${quiz}.xml`);
        const quizXmlData = fs.readFileSync(quizFilePath, "utf-8");
        const quizParsed = await xml2js.parseStringPromise(quizXmlData);

        const feedback = {};
        quizParsed.quiz.question.forEach((q, index) => {
            const qId = q.id?.[0] || String(index);
            feedback[qId] = q.answer
                .map((a, i) => (a.correct?.[0] === "True" ? i : null))
                .filter(i => i !== null);
        });

        // 2. HÅNDTERING AF RESULTS.XML (Her var fejlen!)
        const resultsPath = path.join(__dirname, "../../data/results.xml");

        // Vi definerer resultsObj her, så den eksisterer før vi bruger den
        let resultsObj;

        if (fs.existsSync(resultsPath)) {
            const existingXml = fs.readFileSync(resultsPath, "utf-8");
            resultsObj = await xml2js.parseStringPromise(existingXml);
        } else {
            // Hvis filen ikke findes, opretter vi en tom struktur
            resultsObj = { results: { result: [] } };
        }

        // Nu kan vi sikkert pushe til resultsObj
        resultsObj.results.result.push({
            attemptId: [`${user}-${Date.now()}`],
            userId: [user],
            quizId: [quiz],
            score: [score.toString()],
            time: [time.toString()],
            date: [new Date().toISOString()]
        });

        // Gem den opdaterede fil
        const builder = new xml2js.Builder();
        const updatedXml = builder.buildObject(resultsObj);
        fs.writeFileSync(resultsPath, updatedXml);

        // 3. Send succes-svar
        res.json({
            success: true,
            score: score,
            correctAnswers: feedback
        });

    } catch (err) {
        console.error("DER SKETE EN FEJL I SUBMIT:");
        console.error(err);
        res.status(500).json({ error: "Fejl ved submit", details: err.message });
    }
});


module.exports = router;