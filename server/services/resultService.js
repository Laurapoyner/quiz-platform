// Indeholder logik til at gemme quiz resultater i XML

import { readXML, writeXML } from "../utils/xml.js";

// Gemmer et nyt resultat i results.xml
export async function saveResult(result) {
    const path = "./data/results.xml";

    let data;

    try {
        data = await readXML(path);
    } catch {
        // hvis fil ikke findes → start ny
        data = { results: { result: [] } };
    }

    // sørg for array findes
    if (!data.results.result) {
        data.results.result = [];
    }

    // tilføj resultat
    data.results.result.push({
        attemptId: result.attemptId,
        userId: result.userId,
        quizId: result.quizId,
        score: result.score,
        time: result.time,
        date: result.date
    });

    // gem tilbage til XML
    writeXML(path, data);
}