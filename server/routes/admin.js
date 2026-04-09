//admin

// Controller + API endpoints

//Upload quiz = multer
//Slet quiz = fs
//Liste quizeer = fs
//L�se resultater xml2js (via xml.js)
//Gemme resutalter xml2js (via xml.js)


// H�ndterer alle admin endpoints (upload, delete, liste, resultater)

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { readXML } = require("../utils/xml");
const { saveResult } = require("../services/resultService");

const router = express.Router();


// Upload config (gemmer XML filer)
const storage = multer.diskStorage({
    destination: "data/quizzes/",
    filename: (req, file, cb) => {
        cb(null, file.originalname); // gem med original navn
    }
});

const upload = multer({ storage });


//denne kode bruges kun til test
router.get("/upload", (req, res) => {
    res.send("Upload virker");
});
//slut her


// POST /admin/upload
// Upload en XML quiz fil
router.post("/upload", upload.single("quiz"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    res.send({
        message: "Quiz uploaded successfully",
        file: req.file.filename
    });
});


// GET /admin/quizzes
// Returnerer liste af alle quiz filer
router.get("/quizzes", (req, res) => {
    const files = fs.readdirSync(path.join(__dirname, "../../data/quizzes"));
    res.send(files);
});


// DELETE /admin/quiz/:name
// Sletter en quiz baseret p� filnavn
router.delete("/quiz/:name", (req, res) => {
    const filePath = path.join("data/quizzes", req.params.name);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Quiz not found");
    }

    fs.unlinkSync(filePath);

    res.send({ message: "Quiz deleted" });
});


// GET /admin/results
// Returnerer alle resultater fra XML

router.get("/results", async (req, res) => {
    try {
        const data = await readXML(path.join(__dirname, "../../data/results.xml"));
        res.send(data);
    } catch {
        res.send({ results: [] });
    }
});


// POST /admin/results
// Gemmer et nyt quiz resultat (bruges af quiz engine)
router.post("/results", async (req, res) => {
    await saveResult(req.body);
    res.send({ message: "Result saved" });
});


module.exports = router;