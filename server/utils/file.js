//xml

// funktioner der laves her
//her1
//her2

const fs = require("fs");
const path = require("path")

const filePath = path.join(__dirname, "../data/users.json");

const readUsers = () => {
    const data = fs.readFileSync(filePath, "utf-8");

    // hvis filen er tom, så returnere den også et tomt array
    return data ? JSON.parse(data) : [];
};

const writeUsers = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readUsers, writeUsers};