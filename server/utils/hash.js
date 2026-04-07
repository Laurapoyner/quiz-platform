//hash

//shuffle sp�rgsm�l
//sanitize HTML
//hash password

//bcrypt lib
const bcrypt = require("bcrypt");

//Hashing function & salting 10 rounds
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};



const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };