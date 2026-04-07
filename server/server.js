//server
const express = require("express");
const app = express();

//import af routes
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");

app.use(express.json());

//routes
app.use("/api", adminRoutes);
app.use("/api", authRoutes);
app.use("/api", quizRoutes);

app.listen(3000, () => {
    console.log("Serverport: 3000");
})

// funktioner der laves her
//her1
//her2