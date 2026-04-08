//auth

// funktioner der laves her
//her1
//her2

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const {hashPassword, comparePassword} = require("../utils/hash");
const {readUsers, writeUsers} = require("../utils/file")
const {auth} = require("../middleware/authMiddleware");