const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

/**
 * Beregner scoren baseret på XML-filen og brugerens svar.
 * Sker på serveren for at undgå snyd.
 */
async function calculateScore(quizId, userAnswers) {
    // 1. Find og læs den korrekte quiz-fil
    const filePath = path.join(__dirname, '../../data/quizzes', `${quizId}.xml`);
    const xml = fs.readFileSync(filePath, 'utf-8');
    const result = await xml2js.parseStringPromise(xml);
    const questions = result.quiz.question;

    let totalScore = 0;

    // 2. Gennemgå hvert spørgsmål i XML'en
    questions.forEach((q, index) => {
        const qId = q.id?.[0] || String(index);
        const userAnswer = userAnswers[qId]; // Hvad svarede brugeren?
        const answers = q.answer;

        // 3. Identificer de korrekte svar-index i XML-filen
        const correctIndexes = answers
            .map((a, i) => (a.correct?.[0] === "True" ? i : null))
            .filter((i) => i !== null);

        // Bestem om det er et multi-choice spørgsmål
        const isMulti = correctIndexes.length > 1;

        // Hvis brugeren ikke har svaret, gå videre
        if (userAnswer === undefined || userAnswer === null || userAnswer === "") return;

        if (!isMulti) {
            // SINGLE CHOICE: Giv 1 point hvis svaret matcher et korrekt index
            if (correctIndexes.includes(Number(userAnswer))) {
                totalScore += 1;
            }
        } else {
            // MULTI CHOICE: Avanceret pointsystem
            const selectedArr = Array.isArray(userAnswer) ? userAnswer.map(Number) : [Number(userAnswer)];

            let correctChosen = 0;
            let wrongChosen = 0;

            // Tæl hvor mange rigtige og forkerte brugeren har valgt
            selectedArr.forEach(index => {
                if (correctIndexes.includes(index)) {
                    correctChosen++;
                } else {
                    wrongChosen++;
                }
            });

            // Logik for point (0.5 for ét rigtigt, -0.5 for forkert etc.)
            let points = 0;
            if (correctChosen === 1 && wrongChosen === 0) points = 0.5;
            if (correctChosen === 2 && wrongChosen === 0) points = 1;
            if (correctChosen === 0 && wrongChosen === 1) points = -0.5;
            if (correctChosen === 1 && wrongChosen === 1) points = 0;
            if (correctChosen === 2 && wrongChosen === 1) points = 0.5;
            if (correctChosen === 0 && wrongChosen === 2) points = -1;
            if (correctChosen === 1 && wrongChosen === 2) points = -0.5;
            if (correctChosen === 2 && wrongChosen === 2) points = 0;

            totalScore += points;
        }
    });

    return totalScore;
}

module.exports = { calculateScore };