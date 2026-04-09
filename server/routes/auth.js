//auth
// funktioner der laves her
//her1
//her2

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../utils/hash");
const { readUsers, writeUsers } = require("../utils/file");
const { auth } = require("../middleware/authMiddleware");


// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password too weak" });
  }

  const users = readUsers();

  const exists = users.find((u) => u.username === username);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await hashPassword(password);

  const newUser = {
    id: Date.now(),
    username,
    password: hashed,
    role: "user",
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "User created" });
});


// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "Invalid login" });
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid login" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
    },
    "secretkey",
    { expiresIn: "1h" }
  );

  res.json({ token });
});


// GET /me
router.get("/me", auth, (req, res) => {
  res.json(req.user);
});


module.exports = router;