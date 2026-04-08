const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));            // cors

app.use(express.json());


//import af routes

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");


//routes

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);



app.listen(3000, () => {
    console.log("Server: http://localhost:3000");
});

