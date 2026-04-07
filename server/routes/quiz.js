//quiz
/**
 * Midlertidig router
 * Skal udvides med rigtige endpoints
 */
const express = require('express');
const router = express.Router();

router.get('/quiz/test', (req, res) => {
    res.json({ message: "quiz route works" });
});

module.exports = router;
// funktioner der laves her
//her1
//her2