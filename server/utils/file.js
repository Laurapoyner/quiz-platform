//xml

// funktioner der laves her
//her1
//her2

const fs = require("fs");
const path = require("path")

const filePath = path.join(__dirname, "../data/users.json");

const readUsers = () => {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeUsers = () => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readUsers, writeUsers};