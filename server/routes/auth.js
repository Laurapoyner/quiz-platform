//auth
/**
 * Midlertidig router
 * Skal udvides med rigtige endpoints
 */
const express = require('express');
const router = express.Router();

router.get('/auth/test', (req, res) => {
    res.json({ message: "auth route works" });
});

module.exports = router;
// funktioner der laves her
//her1
//her2